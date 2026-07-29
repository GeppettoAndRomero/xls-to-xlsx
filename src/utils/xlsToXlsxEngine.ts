import { AppError } from './appError';

const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type ConversionPhase =
  | 'loadingLibraries'
  | 'readingWorkbook'
  | 'copyingValues'
  | 'writingWorkbook';

export interface ConversionProgress {
  phase: ConversionPhase;
  completed: number;
  total: number;
  sheetName?: string;
}

export interface XlsToXlsxResult {
  blob: Blob;
  sheetCount: number;
  rowCount: number;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

type RowValue = string | number | boolean | Date | null | undefined;

/**
 * Rebuild an XLS/XLSX workbook as XLSX using cell values only.
 *
 * SheetJS reads BIFF using its lazily loaded code-page table. ExcelJS writes a
 * new OOXML workbook. Formulas, formatting, macros, charts, forms and other
 * workbook objects are intentionally not copied.
 */
export async function convertXlsToXlsx(
  file: File,
  onProgress?: ProgressCallback
): Promise<XlsToXlsxResult> {
  onProgress?.({ phase: 'loadingLibraries', completed: 0, total: 1 });

  let sheetJs: typeof import('xlsx');
  let ExcelJS: typeof import('exceljs');
  try {
    const [sheetJsModule, codePageModule, excelJsModule] = await Promise.all([
      import('xlsx'),
      import('xlsx/dist/cpexcel'),
      import('exceljs'),
    ]);
    sheetJs = sheetJsModule;
    sheetJs.set_cptable(codePageModule);
    ExcelJS =
      (
        excelJsModule as unknown as {
          default?: typeof import('exceljs');
        }
      ).default ?? excelJsModule;
  } catch {
    throw new AppError('errConversionFailed');
  }

  onProgress?.({ phase: 'readingWorkbook', completed: 0, total: 1 });

  let sourceWorkbook: import('xlsx').WorkBook;
  try {
    const sourceBytes = await file.arrayBuffer();
    sourceWorkbook = sheetJs.read(sourceBytes, { type: 'array' });
  } catch {
    throw new AppError('errUnreadableWorkbook');
  }

  if (sourceWorkbook.SheetNames.length === 0) {
    throw new AppError('errNoWorksheets');
  }

  const outputWorkbook = new ExcelJS.Workbook();
  let rowCount = 0;
  const totalSheets = sourceWorkbook.SheetNames.length;

  for (const [sheetIndex, sheetName] of sourceWorkbook.SheetNames.entries()) {
    const sourceSheet = sourceWorkbook.Sheets[sheetName];
    if (!sourceSheet) continue;

    const outputSheet = outputWorkbook.addWorksheet(sheetName);
    const rows = sheetJs.utils.sheet_to_json(sourceSheet, {
      header: 1,
      raw: true,
    }) as RowValue[][];

    for (const row of rows) {
      outputSheet.addRow(row);
      rowCount += 1;
    }

    onProgress?.({
      phase: 'copyingValues',
      completed: sheetIndex + 1,
      total: totalSheets,
      sheetName,
    });
  }

  onProgress?.({ phase: 'writingWorkbook', completed: 0, total: 1 });

  try {
    const outputBytes = await outputWorkbook.xlsx.writeBuffer();
    const blob = new Blob([outputBytes as BlobPart], { type: XLSX_MIME });
    onProgress?.({ phase: 'writingWorkbook', completed: 1, total: 1 });
    return {
      blob,
      sheetCount: outputWorkbook.worksheets.length,
      rowCount,
    };
  } catch {
    throw new AppError('errWriteWorkbook');
  }
}

export function xlsxFileName(originalName: string): string {
  const baseName = originalName.replace(/\.xlsx?$/i, '');
  return `${baseName || 'converted'}.xlsx`;
}

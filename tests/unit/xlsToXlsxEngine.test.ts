import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import {
  convertXlsToXlsx,
  xlsxFileName,
} from '@/utils/xlsToXlsxEngine';

function fixtureFile(): File {
  const bytes = readFileSync(
    fileURLToPath(
      new URL('../fixtures/xls/sample-japanese.xls', import.meta.url)
    )
  );
  return new File([bytes], 'sample-japanese.xls', {
    type: 'application/vnd.ms-excel',
  });
}

describe('convertXlsToXlsx', () => {
  it('decodes CP932 text and copies sheet names and values into XLSX', async () => {
    const phases: string[] = [];
    const result = await convertXlsToXlsx(fixtureFile(), (progress) => {
      phases.push(progress.phase);
    });

    expect(result.sheetCount).toBe(2);
    expect(result.rowCount).toBe(6);
    expect(result.blob.type).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const output = XLSX.read(await result.blob.arrayBuffer(), { type: 'array' });
    expect(output.SheetNames).toEqual(['日本語', 'Summary']);
    expect(
      XLSX.utils.sheet_to_json(output.Sheets['日本語'], {
        header: 1,
        raw: true,
      })
    ).toEqual([
      ['項目', '値'],
      ['あいさつ', 'こんにちは'],
      ['都市', '東京'],
      ['数量', 42],
    ]);
    expect(phases).toContain('loadingLibraries');
    expect(phases).toContain('copyingValues');
    expect(phases.at(-1)).toBe('writingWorkbook');
  });
});

describe('xlsxFileName', () => {
  it('replaces XLS and XLSX extensions without changing the base name', () => {
    expect(xlsxFileName('report.XLS')).toBe('report.xlsx');
    expect(xlsxFileName('quarter.one.xlsx')).toBe('quarter.one.xlsx');
  });
});

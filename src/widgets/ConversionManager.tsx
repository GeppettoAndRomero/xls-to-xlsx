import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { resolveErrorMessage } from '@/utils/appError';
import { validateFile } from '@/utils/fileValidation';
import {
  convertXlsToXlsx,
  xlsxFileName,
  type ConversionPhase,
  type XlsToXlsxResult,
} from '@/utils/xlsToXlsxEngine';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface ConversionManagerProps {
  locale?: string;
}

interface ResultState extends XlsToXlsxResult {
  inputName: string;
  outputName: string;
  inputWasXlsx: boolean;
}

const copy = {
  en: {
    uploadHeading: 'Choose an Excel 97–2003 workbook',
    uploadSubtitle: 'Select one .xls file. An existing .xlsx file is also accepted.',
    dropClick: 'Click to choose a workbook',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'Supported: XLS (XLSX is accepted)',
    lossNotice:
      'The new workbook contains sheet names and cell values. Macros, formulas, formatting, charts, forms and other workbook objects are not carried over.',
    loadingLibraries: 'Loading spreadsheet libraries…',
    readingWorkbook: 'Reading the workbook…',
    copyingValues: 'Copying values from {sheet}…',
    writingWorkbook: 'Writing the XLSX file…',
    resultHeading: 'Converted workbook',
    resultSummary: '{sheets} sheet(s) and {rows} row(s) were written.',
    alreadyXlsx:
      'The input was already an XLSX file. The downloaded file is a values-only rebuilt copy.',
    downloadStarted: 'The XLSX download has started.',
    downloadAgain: 'Download again',
    notificationsAria: 'Notifications',
    errUnsupported:
      '{name} is not supported. Choose one .xls file; an existing .xlsx file is also accepted.',
    errSingleFile: 'Choose one workbook at a time.',
    errBusy: 'Wait for the current workbook to finish before choosing another file.',
    errUnreadableWorkbook:
      'The workbook could not be read as an XLS or XLSX file. It may be damaged, encrypted or use an unsupported variant.',
    errNoWorksheets: 'No worksheets were found in this workbook.',
    errWriteWorkbook: 'The XLSX file could not be written.',
    errConversionFailed: 'The workbook could not be converted.',
  },
  ja: {
    uploadHeading: 'Excel 97–2003 ブックを選択',
    uploadSubtitle: '.xls を1ファイル選んでください。既存の .xlsx も受け付けます。',
    dropClick: 'クリックしてブックを選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: '対応形式: XLS（XLSX も受け付けます）',
    lossNotice:
      '新しいブックへ移すのはシート名とセルの値です。マクロ、数式、書式、グラフ、フォームなどのブック要素は引き継がれません。',
    loadingLibraries: '表計算ライブラリを読み込んでいます…',
    readingWorkbook: 'ブックを読み込んでいます…',
    copyingValues: '「{sheet}」の値を移しています…',
    writingWorkbook: 'XLSX ファイルを書き出しています…',
    resultHeading: '変換結果',
    resultSummary: '{sheets}シート、{rows}行を書き出しました。',
    alreadyXlsx:
      '入力ファイルはすでに XLSX 形式です。値だけで再構成したコピーをダウンロードしました。',
    downloadStarted: 'XLSX のダウンロードを開始しました。',
    downloadAgain: 'もう一度ダウンロード',
    notificationsAria: '通知',
    errUnsupported:
      '「{name}」は対応形式ではありません。.xls を1ファイル選んでください（.xlsx も受け付けます）。',
    errSingleFile: 'ブックは1ファイルずつ選んでください。',
    errBusy: '現在の処理が終わってから、次のファイルを選んでください。',
    errUnreadableWorkbook:
      'XLS / XLSX ブックとして読み取れませんでした。破損、暗号化、または対応外の形式である可能性があります。',
    errNoWorksheets: 'このブックにはワークシートが見つかりませんでした。',
    errWriteWorkbook: 'XLSX ファイルを書き出せませんでした。',
    errConversionFailed: 'ブックを変換できませんでした。',
  },
  zh: {
    uploadHeading: '选择 Excel 97–2003 工作簿',
    uploadSubtitle: '请选择一个 .xls 文件；也可以选择已有的 .xlsx 文件。',
    dropClick: '点击选择工作簿',
    dropOr: '或拖放到页面任意位置',
    dropSupported: '支持：XLS（也接受 XLSX）',
    lossNotice:
      '新工作簿只保留工作表名称和单元格值。宏、公式、格式、图表、窗体及其他工作簿对象不会迁移。',
    loadingLibraries: '正在加载电子表格组件…',
    readingWorkbook: '正在读取工作簿…',
    copyingValues: '正在复制“{sheet}”中的值…',
    writingWorkbook: '正在生成 XLSX 文件…',
    resultHeading: '转换结果',
    resultSummary: '已写入 {sheets} 个工作表、{rows} 行数据。',
    alreadyXlsx: '输入文件已经是 XLSX 格式；下载的是仅按值重新生成的副本。',
    downloadStarted: '已开始下载 XLSX 文件。',
    downloadAgain: '再次下载',
    notificationsAria: '通知',
    errUnsupported: '不支持“{name}”。请选择一个 .xls 文件；也可以选择 .xlsx。',
    errSingleFile: '每次请选择一个工作簿。',
    errBusy: '请等待当前工作簿处理完成后再选择其他文件。',
    errUnreadableWorkbook:
      '无法将该文件读取为 XLS / XLSX 工作簿。文件可能已损坏、已加密，或采用了不支持的格式。',
    errNoWorksheets: '此工作簿中没有找到工作表。',
    errWriteWorkbook: '无法生成 XLSX 文件。',
    errConversionFailed: '无法转换此工作簿。',
  },
  de: {
    uploadHeading: 'Excel-97–2003-Arbeitsmappe auswählen',
    uploadSubtitle: 'Wähle eine .xls-Datei. Eine vorhandene .xlsx-Datei wird ebenfalls angenommen.',
    dropClick: 'Arbeitsmappe auswählen',
    dropOr: 'oder auf der Seite ablegen',
    dropSupported: 'Unterstützt: XLS (XLSX wird ebenfalls angenommen)',
    lossNotice:
      'Die neue Arbeitsmappe enthält Blattnamen und Zellwerte. Makros, Formeln, Formatierungen, Diagramme, Formulare und andere Arbeitsmappenobjekte werden nicht übernommen.',
    loadingLibraries: 'Tabellenbibliotheken werden geladen…',
    readingWorkbook: 'Arbeitsmappe wird gelesen…',
    copyingValues: 'Werte aus „{sheet}“ werden übertragen…',
    writingWorkbook: 'XLSX-Datei wird geschrieben…',
    resultHeading: 'Konvertierte Arbeitsmappe',
    resultSummary: '{sheets} Tabellenblatt/-blätter und {rows} Zeile(n) wurden geschrieben.',
    alreadyXlsx:
      'Die Eingabe war bereits eine XLSX-Datei. Heruntergeladen wurde eine nur aus Werten neu aufgebaute Kopie.',
    downloadStarted: 'Der XLSX-Download wurde gestartet.',
    downloadAgain: 'Erneut herunterladen',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported:
      '„{name}“ wird nicht unterstützt. Wähle eine .xls-Datei; .xlsx wird ebenfalls angenommen.',
    errSingleFile: 'Wähle jeweils nur eine Arbeitsmappe aus.',
    errBusy: 'Warte, bis die aktuelle Arbeitsmappe verarbeitet wurde.',
    errUnreadableWorkbook:
      'Die Datei konnte nicht als XLS-/XLSX-Arbeitsmappe gelesen werden. Sie ist möglicherweise beschädigt, verschlüsselt oder verwendet eine nicht unterstützte Variante.',
    errNoWorksheets: 'In dieser Arbeitsmappe wurden keine Tabellenblätter gefunden.',
    errWriteWorkbook: 'Die XLSX-Datei konnte nicht geschrieben werden.',
    errConversionFailed: 'Die Arbeitsmappe konnte nicht konvertiert werden.',
  },
  es: {
    uploadHeading: 'Selecciona un libro de Excel 97–2003',
    uploadSubtitle: 'Elige un archivo .xls. También se admite un .xlsx existente.',
    dropClick: 'Haz clic para elegir un libro',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Formatos admitidos: XLS (también XLSX)',
    lossNotice:
      'El libro nuevo contiene los nombres de las hojas y los valores de las celdas. No se transfieren macros, fórmulas, formatos, gráficos, formularios ni otros objetos del libro.',
    loadingLibraries: 'Cargando las bibliotecas de hojas de cálculo…',
    readingWorkbook: 'Leyendo el libro…',
    copyingValues: 'Copiando los valores de «{sheet}»…',
    writingWorkbook: 'Generando el archivo XLSX…',
    resultHeading: 'Libro convertido',
    resultSummary: 'Se escribieron {sheets} hoja(s) y {rows} fila(s).',
    alreadyXlsx:
      'El archivo de entrada ya estaba en formato XLSX. La descarga es una copia reconstruida solo con valores.',
    downloadStarted: 'Ha comenzado la descarga del XLSX.',
    downloadAgain: 'Descargar de nuevo',
    notificationsAria: 'Notificaciones',
    errUnsupported:
      '«{name}» no es compatible. Elige un archivo .xls; también se admite .xlsx.',
    errSingleFile: 'Selecciona un solo libro cada vez.',
    errBusy: 'Espera a que termine el libro actual antes de seleccionar otro archivo.',
    errUnreadableWorkbook:
      'No se pudo leer el archivo como libro XLS/XLSX. Puede estar dañado, cifrado o usar una variante no compatible.',
    errNoWorksheets: 'No se encontraron hojas en este libro.',
    errWriteWorkbook: 'No se pudo generar el archivo XLSX.',
    errConversionFailed: 'No se pudo convertir el libro.',
  },
} as const;

type Locale = keyof typeof copy;
type LocalCopy = (typeof copy)[Locale];

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.split(`{${key}}`).join(String(value));
  }
  return result;
}

function progressPercent(
  phase: ConversionPhase,
  completed: number,
  total: number
): number {
  if (phase === 'loadingLibraries') return completed > 0 ? 10 : 5;
  if (phase === 'readingWorkbook') return 20;
  if (phase === 'copyingValues') {
    return 20 + Math.round((completed / Math.max(total, 1)) * 65);
  }
  return completed > 0 ? 100 : 90;
}

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const t: LocalCopy = copy[(locale in copy ? locale : 'en') as Locale];
  const busyRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState<string>(t.loadingLibraries);
  const [result, setResult] = useState<ResultState | null>(null);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((previous) => [...previous, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((previous) =>
      previous.filter((toast) => toast.id !== id)
    );
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (busyRef.current) {
        showErrorToast(t.errBusy);
        return;
      }

      busyRef.current = true;
      setBusy(true);
      setProgress(0);
      setPhaseText(t.loadingLibraries);
      setResult(null);

      try {
        const converted = await convertXlsToXlsx(file, (update) => {
          setProgress(
            progressPercent(update.phase, update.completed, update.total)
          );
          if (update.phase === 'copyingValues') {
            setPhaseText(
              t.copyingValues.replace('{sheet}', update.sheetName ?? '')
            );
          } else {
            setPhaseText(t[update.phase]);
          }
        });
        const nextResult: ResultState = {
          ...converted,
          inputName: file.name,
          outputName: xlsxFileName(file.name),
          inputWasXlsx: /\.xlsx$/i.test(file.name),
        };
        setResult(nextResult);
        downloadBlob(nextResult.blob, nextResult.outputName);
      } catch (error) {
        showErrorToast(
          `${file.name}: ${resolveErrorMessage(
            error,
            t as unknown as Record<string, string>
          )}`
        );
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [showErrorToast, t]
  );

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length !== 1) {
        if (files.length > 0) showErrorToast(t.errSingleFile);
        window.dispatchEvent(new CustomEvent('filesProcessed'));
        return;
      }

      const file = files[0];
      if (!validateFile(file).valid) {
        showErrorToast(t.errUnsupported.replace('{name}', file.name));
        window.dispatchEvent(new CustomEvent('filesProcessed'));
        return;
      }

      void processFile(file).finally(() => {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
      });
    },
    [processFile, showErrorToast, t]
  );

  useEffect(() => {
    const handler = (event: Event) => {
      handleFiles((event as CustomEvent<File[]>).detail);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label={t.dropClick}
          aria-disabled={busy}
          style={{
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            cursor: busy ? 'wait' : 'pointer',
          }}
          onClick={() => {
            if (!busy) document.getElementById('file-input')?.click();
          }}
          onKeyDown={(event) => {
            if (!busy && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              document.getElementById('file-input')?.click();
            }
          }}
        >
          <div style="font-size: 3rem; margin-bottom: var(--space-2);" aria-hidden="true">
            📊
          </div>
          <div style="font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
            {t.dropClick}
          </div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle);">
            {t.dropOr}
          </div>
          <div style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-1);">
            {t.dropSupported}
          </div>
          <input
            id="file-input"
            type="file"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            disabled={busy}
            onChange={(event) => {
              handleFiles(Array.from(event.currentTarget.files || []));
              event.currentTarget.value = '';
            }}
            style="display: none;"
          />
        </div>

        <p
          data-testid="conversion-loss-notice"
          style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);"
        >
          {t.lossNotice}
        </p>

        {busy && (
          <div
            role="status"
            aria-live="polite"
            data-testid="conversion-progress"
            style="margin-top: var(--space-4);"
          >
            <p style="margin: 0 0 var(--space-2) 0;">{phaseText}</p>
            <progress value={progress} max={100} style="width: 100%;">
              {progress}%
            </progress>
          </div>
        )}

        {result && (
          <div
            data-testid="conversion-result"
            aria-live="polite"
            style="margin-top: var(--space-4); padding: var(--space-4); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm);"
          >
            <h3 style="margin: 0 0 var(--space-2) 0; font-size: var(--fs-3);">
              {t.resultHeading}
            </h3>
            <strong>{result.inputName}</strong>
            <p>
              {interpolate(t.resultSummary, {
                sheets: result.sheetCount,
                rows: result.rowCount,
              })}
            </p>
            {result.inputWasXlsx && <p>{t.alreadyXlsx}</p>}
            <p>{t.downloadStarted}</p>
            <AppButton
              variant="secondary"
              onClick={() => downloadBlob(result.blob, result.outputName)}
            >
              {t.downloadAgain}
            </AppButton>
          </div>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div
          className="error-toast-container"
          aria-label={t.notificationsAria}
        >
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

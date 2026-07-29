import { describe, expect, it } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps a known code to localized strings', () => {
    expect(resolveErrorMessage('errDownloadFailed', ui.en)).toBe(
      'Download failed'
    );
    expect(resolveErrorMessage('errDownloadFailed', ui.ja)).toBe(
      'ダウンロードに失敗しました'
    );
    expect(resolveErrorMessage(new AppError('errWorkerStopped'), ui.de)).toBe(
      'Die Verarbeitung wurde gestoppt. Bitte lade die Seite neu und versuche es erneut.'
    );
  });

  it('falls back to the localized generic message for unmapped errors', () => {
    expect(resolveErrorMessage('internal-error', ui.zh)).toBe(
      ui.zh.errConversionFailed
    );
    expect(resolveErrorMessage(undefined, ui.es)).toBe(
      ui.es.errConversionFailed
    );
  });
});

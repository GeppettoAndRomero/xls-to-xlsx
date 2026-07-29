import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Download, type Page } from '@playwright/test';

export const XLS_B64 = readFileSync(
  fileURLToPath(
    new URL('../fixtures/xls/sample-japanese.xls', import.meta.url)
  )
).toString('base64');

export async function waitReady(page: Page) {
  await page.waitForFunction(
    () => (window as Record<string, unknown>).__toolReady === true
  );
}

export async function convert(page: Page): Promise<Download> {
  const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
  await page.evaluate((base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    window.dispatchEvent(
      new CustomEvent('filesDropped', {
        detail: [
          new File([bytes], 'sample-japanese.xls', {
            type: 'application/vnd.ms-excel',
          }),
        ],
      })
    );
  }, XLS_B64);
  return downloadPromise;
}

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import * as XLSX from 'xlsx';
import { convert, waitReady } from './_helpers';

test.describe('XLS to XLSX conversion', () => {
  test('converts a BIFF workbook, preserves Japanese values and makes no upload request', async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (
        !url.startsWith('http://localhost:4321') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        externalRequests.push(url);
      }
    });

    await page.goto('/xls-to-xlsx/');
    await waitReady(page);
    const download = await convert(page);

    expect(download.suggestedFilename()).toBe('sample-japanese.xlsx');
    const path = await download.path();
    expect(path).toBeTruthy();

    const bytes = readFileSync(path as string);
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);

    const workbook = XLSX.read(bytes, { type: 'buffer' });
    expect(workbook.SheetNames).toEqual(['日本語', 'Summary']);
    expect(
      XLSX.utils.sheet_to_json(workbook.Sheets['日本語'], {
        header: 1,
        raw: true,
      })
    ).toEqual([
      ['項目', '値'],
      ['あいさつ', 'こんにちは'],
      ['都市', '東京'],
      ['数量', 42],
    ]);
    expect(
      XLSX.utils.sheet_to_json(workbook.Sheets['Summary'], {
        header: 1,
        raw: true,
      })
    ).toEqual([
      ['Category', 'Amount'],
      ['Sample', 1234.5],
    ]);

    await expect(page.getByTestId('conversion-result')).toContainText(
      '2 sheet(s) and 6 row(s)'
    );
    await expect(page.getByTestId('conversion-loss-notice')).toContainText(
      'Macros'
    );
    expect(
      externalRequests,
      `unexpected cross-origin requests: ${externalRequests.join(', ')}`
    ).toEqual([]);
  });
});

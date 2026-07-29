import { describe, expect, it } from 'vitest';
import {
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const fileStub = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it('accepts .xls regardless of case', () => {
    expect(validateFileExtension('book.XLS').valid).toBe(true);
  });

  it('accepts an existing .xlsx workbook', () => {
    expect(validateFileExtension('book.xlsx').valid).toBe(true);
  });

  it('rejects XLSM and unrelated extensions', () => {
    expect(validateFileExtension('book.xlsm').valid).toBe(false);
    expect(validateFileExtension('book.csv').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it('accepts the XLS mime type', () => {
    expect(
      validateFileMimeType(
        fileStub('book.xls', 'application/vnd.ms-excel')
      ).valid
    ).toBe(true);
  });

  it('accepts an empty mime type', () => {
    expect(validateFileMimeType(fileStub('book.xls')).valid).toBe(true);
  });

  it('rejects an unrelated mime type', () => {
    expect(
      validateFileMimeType(fileStub('book.xls', 'image/png')).valid
    ).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts XLS by extension even with a generic browser mime type', () => {
    expect(
      validateFile(
        fileStub('legacy.xls', 'application/octet-stream')
      ).valid
    ).toBe(true);
  });

  it('accepts XLSX by extension', () => {
    expect(
      validateFile(
        fileStub(
          'existing.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
  });

  it('rejects a file with an unsupported extension', () => {
    expect(
      validateFile(fileStub('macro.xlsm', 'application/vnd.ms-excel')).valid
    ).toBe(false);
  });
});

describe('validateTotalSize', () => {
  it('accepts files under the 2GB cap', () => {
    expect(
      validateTotalSize([
        fileStub(
          'book.xls',
          'application/vnd.ms-excel',
          10 * 1024 * 1024
        ),
      ]).valid
    ).toBe(true);
  });

  it('rejects when the combined size exceeds the cap', () => {
    expect(
      validateTotalSize([
        fileStub(
          'a.xls',
          'application/vnd.ms-excel',
          2 * 1024 * 1024 * 1024
        ),
        fileStub('b.xls', 'application/vnd.ms-excel', 1),
      ]).valid
    ).toBe(false);
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters with underscores', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.xls')).toBe('a_b_c_d_e_.xls');
  });
});

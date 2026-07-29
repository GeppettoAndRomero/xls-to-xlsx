import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { URL, fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';
import * as codePages from 'xlsx/dist/cpexcel';

XLSX.set_fs(fs);

const replacements = new Map([
  ['J001', '項目'],
  ['V1', '値'],
  ['J002J002', 'あいさつ'],
  ['J003J003J0', 'こんにちは'],
  ['J004', '都市'],
  ['J005', '東京'],
  ['J006', '数量'],
]);
const sheetNamePlaceholder = 'JPNSHT';
const japaneseSheetName = '日本語';

const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  workbook,
  XLSX.utils.aoa_to_sheet([
    ['J001', 'V1'],
    ['J002J002', 'J003J003J0'],
    ['J004', 'J005'],
    ['J006', 42],
  ]),
  sheetNamePlaceholder
);

XLSX.utils.book_append_sheet(
  workbook,
  XLSX.utils.aoa_to_sheet([
    ['Category', 'Amount'],
    ['Sample', 1234.5],
  ]),
  'Summary'
);

function encodeCp932(value) {
  return Uint8Array.from(codePages.utils.encode(932, value, 'arr'));
}

function ascii(bytes) {
  return String.fromCharCode(...bytes);
}

function replaceBytes(target, offset, length, value) {
  const encoded = encodeCp932(value);
  assert.equal(
    encoded.length,
    length,
    `CP932 replacement length mismatch for ${value}`
  );
  target.set(encoded, offset);
}

// SheetJS writes BIFF5 text as single-byte LABEL records, but its writer fixes
// the code page to 1252. Start with same-length ASCII placeholders, then replace
// those bytes with CP932 and update the BIFF CODEPAGE record to 932. This makes
// the fixture exercise the reader's legacy code-page path rather than BIFF8
// Unicode strings.
const template = XLSX.write(workbook, {
  type: 'buffer',
  bookType: 'biff5',
});
const compoundFile = XLSX.CFB.read(template, { type: 'buffer' });
const workbookEntry = compoundFile.FileIndex.find(
  (entry) => entry.name === 'Book' || entry.name === 'Workbook'
);
assert(workbookEntry?.content, 'BIFF workbook stream was not found');

const stream = workbookEntry.content;
let offset = 0;
let labelReplacements = 0;
let sheetNameReplaced = false;
let codePageReplaced = false;

while (offset + 4 <= stream.length) {
  const recordId = stream[offset] | (stream[offset + 1] << 8);
  const recordLength = stream[offset + 2] | (stream[offset + 3] << 8);
  const payloadOffset = offset + 4;

  if (recordId === 0x0042 && recordLength >= 2) {
    stream[payloadOffset] = 0xa4;
    stream[payloadOffset + 1] = 0x03;
    codePageReplaced = true;
  } else if (recordId === 0x0085 && recordLength >= 7) {
    const nameLength = stream[payloadOffset + 6];
    const nameOffset = payloadOffset + 7;
    const name = ascii(stream.subarray(nameOffset, nameOffset + nameLength));
    if (name === sheetNamePlaceholder) {
      replaceBytes(stream, nameOffset, nameLength, japaneseSheetName);
      sheetNameReplaced = true;
    }
  } else if (recordId === 0x0204 && recordLength >= 8) {
    const textLength =
      stream[payloadOffset + 6] | (stream[payloadOffset + 7] << 8);
    const textOffset = payloadOffset + 8;
    const placeholder = ascii(
      stream.subarray(textOffset, textOffset + textLength)
    );
    const replacement = replacements.get(placeholder);
    if (replacement) {
      replaceBytes(stream, textOffset, textLength, replacement);
      labelReplacements += 1;
    }
  }

  offset += 4 + recordLength;
}

assert(codePageReplaced, 'BIFF CODEPAGE record was not found');
assert(sheetNameReplaced, 'Worksheet name placeholder was not found');
assert.equal(labelReplacements, replacements.size);

const outputPath = fileURLToPath(
  new URL('./sample-japanese.xls', import.meta.url)
);
fs.writeFileSync(
  outputPath,
  XLSX.CFB.write(compoundFile, { type: 'buffer' })
);

XLSX.set_cptable(codePages);
const check = XLSX.readFile(outputPath);
assert.equal(check.SheetNames[0], japaneseSheetName);
assert.deepEqual(
  XLSX.utils.sheet_to_json(check.Sheets[japaneseSheetName], {
    header: 1,
    raw: true,
  }),
  [
    ['項目', '値'],
    ['あいさつ', 'こんにちは'],
    ['都市', '東京'],
    ['数量', 42],
  ]
);

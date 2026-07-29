# XLS conversion fixture

`sample-japanese.xls` is a small BIFF5 workbook with a BIFF `CODEPAGE` value of
932. Its first worksheet has a Japanese name and CP932-encoded Japanese labels
and values; the second worksheet has English text and a number.

Regenerate it from the tool directory:

```sh
node tests/fixtures/xls/generate-fixture.mjs
```

SheetJS writes the initial BIFF5 structure with same-length ASCII placeholders.
The generator then replaces those LABEL and BOUNDSHEET bytes with CP932 data,
changes the `CODEPAGE` record to 932, and uses SheetJS to verify the result.
Conversion tests read the generated XLSX and compare the Japanese text and
numeric values.

import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Convert XLS to XLSX in Your Browser — No Upload | runlocally',
    description:
      'Convert an Excel 97–2003 .xls workbook to .xlsx in your browser. Sheet names and cell values are copied; macros, charts, forms, formulas and formatting are not transferred.',
    ogTitle: 'Convert XLS to XLSX in Your Browser',
    ogDescription:
      'Rebuild an Excel .xls workbook as .xlsx using its sheet names and cell values. The workbook is processed on your device.',
  },

  hero: {
    h1: 'XLS to XLSX Converter',
    tagline:
      'Turn an Excel 97–2003 .xls workbook into .xlsx in your browser. Nothing is uploaded.',
  },

  intro: {
    h2: 'Convert an old XLS workbook to XLSX',
    paras: [
      'The .xls format stores an Excel workbook in the binary BIFF format. This tool reads that workbook with SheetJS, creates a new OOXML workbook with ExcelJS, and saves it with the .xlsx extension.',
      'The conversion is value-based: it carries over worksheet names and cell values. It does not reproduce the original workbook package, so macros, formulas, cell formatting, charts, forms and other workbook objects are not transferred.',
    ],
  },

  privacy: {
    h2: 'The workbook stays on your device',
    lead:
      'The input file is read and the output file is written by code running in this browser:',
    points: [
      'The workbook is not sent to a conversion server.',
      'SheetJS reads the XLS data locally, including the workbook code page.',
      'ExcelJS writes the new XLSX file in the browser.',
      'The source code is available under the MIT License.',
    ],
    note:
      'You can inspect the browser Network panel while converting; no request carries the workbook.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to convert XLS to XLSX',
    steps: [
      {
        h3: 'Choose one XLS workbook',
        p: 'Select an .xls file or drop it on the page. An existing .xlsx file is accepted too, although it does not need a format conversion.',
      },
      {
        h3: 'Wait while values are copied',
        p: 'The tool reads each worksheet and adds its cell values to a new workbook. Review the notice about content that is not carried over.',
      },
      {
        h3: 'Download the XLSX file',
        p: 'The new workbook downloads with the original base name and an .xlsx extension. Your input file is not overwritten.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my Excel file uploaded?',
      a: 'No. The workbook is read and rebuilt in your browser. There is no server-side conversion step.',
    },
    {
      q: 'What is copied into the XLSX file?',
      a: 'Worksheet names and cell values are copied. For a formula cell, the stored result is copied when it is available; the formula itself is not transferred.',
    },
    {
      q: 'What will be lost during conversion?',
      a: 'Macros, formulas, cell formatting, charts, forms, drawings, links between workbook objects and other features outside plain cell values are not carried into the new file.',
    },
    {
      q: 'Will Japanese text in an XLS file be preserved?',
      a: 'SheetJS reads the code-page information in supported XLS workbooks and returns text as Unicode. The conversion fixture includes Japanese text in a BIFF workbook and verifies it in the XLSX output.',
    },
    {
      q: 'Can I use an XLSX file as input?',
      a: 'Yes. The tool will rebuild it as another XLSX file using values only. If you only need the existing XLSX file, conversion is unnecessary.',
    },
    {
      q: 'Does this convert XLSM files or preserve macros?',
      a: 'No. XLSM input and macro transfer are outside the scope of this tool.',
    },
    {
      q: 'Does it work offline?',
      a: 'After the site files and conversion libraries have been cached by the PWA, the conversion can run without a network connection.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; review and decisions remain the maintainer's.",
    securityText: 'Security',
  },

  related: {
    h2: 'Related tools',
    blogLinkText: 'Read the technical notes',
  },
};

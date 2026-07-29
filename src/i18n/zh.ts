import type { ToolContent } from './types';

export const zh: ToolContent = {
  htmlLang: 'zh-Hans',

  meta: {
    title: 'XLS 转 XLSX — 浏览器内处理，无需上传 | runlocally',
    description:
      '在浏览器内把 Excel 97–2003 的 .xls 工作簿转换为 .xlsx。保留工作表名称和单元格值，不迁移宏、图表、窗体、公式或格式。',
    ogTitle: '在浏览器内将 XLS 转为 XLSX',
    ogDescription:
      '把 .xls 工作簿的工作表名称和单元格值写入新的 .xlsx 文件。文件只在本机处理。',
  },

  hero: {
    h1: 'XLS 转 XLSX',
    tagline:
      '在浏览器内把 Excel 97–2003 的 .xls 工作簿转换为 .xlsx，无需上传文件。',
  },

  intro: {
    h2: '把旧版 XLS 工作簿转换为 XLSX',
    paras: [
      '.xls 使用二进制 BIFF 格式保存 Excel 工作簿。本工具通过 SheetJS 读取原文件，再由 ExcelJS 新建 OOXML 工作簿并保存为 .xlsx。',
      '这里采用按值转换：工作表名称和单元格值会写入新文件，但不会复制原工作簿的完整结构。因此，宏、公式、单元格格式、图表、窗体等内容不会迁移。',
    ],
  },

  privacy: {
    h2: '工作簿留在您的设备上',
    lead: '读取输入和生成 XLSX 都由浏览器中的代码完成：',
    points: [
      '工作簿不会发送到在线转换服务。',
      'SheetJS 在本机读取 XLS 数据及其中的代码页信息。',
      'ExcelJS 直接在浏览器内生成新的 XLSX 文件。',
      '源代码以 MIT 许可证公开。',
    ],
    note:
      '转换时可打开浏览器的“网络”面板核对；不会有携带工作簿内容的请求。',
    sourceLinkText: '查看源代码。',
  },

  howto: {
    h2: 'XLS 转 XLSX 的操作步骤',
    steps: [
      {
        h3: '选择一个 XLS 工作簿',
        p: '选择一个 .xls 文件，或将其拖到页面上。已有的 .xlsx 也可以读取，但无需再做格式转换。',
      },
      {
        h3: '等待复制单元格值',
        p: '工具逐个读取工作表，将单元格值加入新工作簿。请先查看页面上关于未迁移内容的说明。',
      },
      {
        h3: '下载 XLSX',
        p: '新文件沿用原文件的主文件名，并改用 .xlsx 扩展名。原文件不会被覆盖。',
      },
    ],
  },

  faqHeading: '常见问题',
  faq: [
    {
      q: 'Excel 文件会上传吗？',
      a: '不会。工作簿在浏览器内读取并重新生成，不经过服务器转换。',
    },
    {
      q: '哪些内容会写入 XLSX？',
      a: '会写入工作表名称和单元格值。公式单元格如果保存了计算结果，会复制该结果，但不会复制公式本身。',
    },
    {
      q: '转换时会丢失哪些内容？',
      a: '宏、公式、单元格格式、图表、窗体、绘图对象及对象间的关联等非普通单元格值内容，不会写入新文件。',
    },
    {
      q: '能处理含有日文的 XLS 文件吗？',
      a: 'SheetJS 会读取其支持的 XLS 代码页信息，并以 Unicode 返回文本。测试使用了含日文的 BIFF 工作簿，并核对 XLSX 输出中的文字。',
    },
    {
      q: '可以选择 XLSX 文件吗？',
      a: '可以。工具会按单元格值重新生成一个 XLSX 副本。如果原 XLSX 可以直接使用，则无需转换。',
    },
    {
      q: '支持 XLSM 或保留宏吗？',
      a: '不支持。.xlsm 输入和宏迁移不在本工具的处理范围内。',
    },
    {
      q: '离线时可以使用吗？',
      a: 'PWA 缓存页面文件和转换组件后，无网络连接时也可以完成转换。',
    },
  ],

  footer: {
    openSourceLabel: '开源（MIT）',
    partOf: '属于',
    brandTail: '— 一组在本机运行的小工具。',
    colophon:
      '由 Geppetto 开发和维护；部分代码使用 AI 辅助，审核与取舍由维护者完成。',
    securityText: '安全',
  },
};

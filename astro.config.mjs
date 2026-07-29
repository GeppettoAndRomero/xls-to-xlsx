import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/xls-to-xlsx/ 配下に「物理配置」する
  // （src/pages/xls-to-xlsx/ + public/xls-to-xlsx/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /xls-to-xlsx/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'xls-to-xlsx/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['preact', 'preact/hooks'],
            'sheetjs': ['xlsx', 'xlsx/dist/cpexcel'],
            'exceljs': ['exceljs'],
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});

import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // GitHub Pages（https://hoikuen.github.io/ojisan-x/）用。
  // 本番ビルドのみ /ojisan-x/、ローカルdev/テストは / のまま。
  base: command === 'build' ? '/ojisan-x/' : '/',
  server: {
    port: 5173,
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
  },
}));

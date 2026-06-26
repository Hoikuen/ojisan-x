import { defineConfig } from '@playwright/test';

// 単一のクリーンなChromiumでゲームを動かし、動きを自動検証する。
// （Claude Preview の複数コンテキスト問題を回避＝動的挙動を確実にテストできる）
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5179',
    headless: true,
  },
  webServer: {
    command: 'npm run dev -- --port 5179 --strictPort',
    port: 5179,
    reuseExistingServer: true,
    timeout: 60000,
  },
});

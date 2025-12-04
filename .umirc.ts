import { defineConfig } from "umi";


export default defineConfig({
  npmClient: 'pnpm',
  base: '/',
  publicPath:'/',
  hash: true,  // 启用文件哈希，确保文件名变化强制更新
  history: {
    type: 'browser',
  }
});

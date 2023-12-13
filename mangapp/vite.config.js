import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['lodash'],
  },
  // 正しいサーバー/エンドポイント設定することにより仮想apiデータでのやり取りが可能になる
  server: {
    proxy: {
      '^/books': { target: 'http://localhost:3000' },
    },
  //   public: 'localhost:5173',
  },
  define: {
    'process.env.VUE_APP_HOST_DB': process.env.VUE_APP_HOST_DB,
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});

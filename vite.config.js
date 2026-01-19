import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버로 전달합니다.
      '/api': {
        target: 'http://localhost:8080', // 실제 백엔드 서버 주소로 변경해주세요.
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // 백엔드에서 /api 경로가 필요 없는 경우 사용
      },
    }
  }
})

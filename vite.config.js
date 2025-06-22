import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // define 섹션 제거 - .env 파일이 정상적으로 로드되도록 함
  // 환경변수는 .env 파일에서 관리됩니다
})

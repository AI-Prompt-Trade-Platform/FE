import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 5173 포트를 명시적으로 설정 (현재 사용 중인 포트와 일치)
    port: 5173,
    // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
    // 'localhost' 문제 해결에 도움이 될 수 있습니다.
    host: true, // 또는 '0.0.0.0'
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 주소
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  
  return {
    plugins: [react()],
    // S3 배포를 위한 base 설정 (버킷 루트에 배포하는 경우 '/' 사용)
    base: '/',
    // 프로덕션 빌드 최적화
    build: {
      minify: true, // 기본 minifier 사용 (esbuild)
      sourcemap: false, // 보안을 위해 소스맵 비활성화
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            auth: ['@auth0/auth0-react']
          }
        }
      }
    },
    // 개발 환경에서만 프록시 활성화
    server: isDev ? {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        }
      }
    } : {},
    // 환경변수는 .env 파일에서 관리됩니다
  }
})

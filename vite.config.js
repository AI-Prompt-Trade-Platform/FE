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
  define: {
    'import.meta.env.VITE_AUTH0_DOMAIN': JSON.stringify('dev-q64r0n0blzhir6y0.us.auth0.com'),
    'import.meta.env.VITE_AUTH0_CLIENT_ID': JSON.stringify('your-client-id-here'),
    'import.meta.env.VITE_AUTH0_AUDIENCE': JSON.stringify('https://api.prumpt.local'),
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8080/api'),
  }
})

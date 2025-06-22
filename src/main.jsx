import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

// .env 파일에서 환경변수 로드
const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

console.log('🔍 Auth0 환경변수 확인:', { domain, clientId, audience })
console.log('🔍 Raw 환경변수:', {
  VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
})

// 환경변수가 로드되지 않았을 때 경고
if (!domain || !clientId || !audience) {
  console.error('❌ .env 파일이 제대로 로드되지 않았습니다!')
  console.error('필요한 환경변수:', ['VITE_AUTH0_DOMAIN', 'VITE_AUTH0_CLIENT_ID', 'VITE_AUTH0_AUDIENCE'])
}

const container = document.getElementById('root');
// container 는 HTMLElement | null 이므로, null 체크 혹은 Non-null 단언(!) 필요
if (!container) {
    throw new Error('No root container');
}

const root = createRoot(container);
root.render(
    <StrictMode>
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: audience,
            }}
        >
            <App />
        </Auth0Provider>
    </StrictMode>
);
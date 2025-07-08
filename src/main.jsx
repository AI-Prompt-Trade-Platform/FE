import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

// .env 파일에서 환경변수 로드 (임시 더미값 포함)
const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dummy-domain.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'dummy-client-id'
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'dummy-audience'

// 환경변수 유효성 검증 (실제 프로덕션에서만 경고)
if (import.meta.env.MODE === 'production' && (!import.meta.env.VITE_AUTH0_DOMAIN || !import.meta.env.VITE_AUTH0_CLIENT_ID || !import.meta.env.VITE_AUTH0_AUDIENCE)) {
  console.warn('Auth0 environment variables are missing in production')
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
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-q64r0n0blzhir6y0.us.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id'
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.prumpt.local'

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
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PromptPage from './pages/PromptPage.jsx';

const container = document.getElementById('root');
// container 는 HTMLElement | null 이므로, null 체크 혹은 Non-null 단언(!) 필요
if (!container) {
    throw new Error('No root container');
}

const root = createRoot(container);
root.render(
    <Auth0Provider
     domain={import.meta.env.VITE_AUTH0_DOMAIN}
     clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
           redirect_uri: window.location.origin,          // 콜백 URL
              audience: import.meta.env.VITE_AUTH0_AUDIENCE, // API 식별자
               scope: 'openid profile email'
        }}
   >
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PromptPage />} />
                <Route path="/prompts" element={<PromptPage />} />
            </Routes>
        </BrowserRouter>
    </Auth0Provider>
);
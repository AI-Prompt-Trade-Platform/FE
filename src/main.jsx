import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');
// container 는 HTMLElement | null 이므로, null 체크 혹은 Non-null 단언(!) 필요
if (!container) {
    throw new Error('No root container');
}

const root = createRoot(container);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
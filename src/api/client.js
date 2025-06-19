// src/api/client.js
import axios from 'axios';

// 기본 인스턴스
const client = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// 토큰을 붙이기 위해 인터셉터 등록
client.interceptors.request.use(
    async config => {
        // Auth0 훅은 컴포넌트 안에서만 가능하므로, 여기서는
        // 컴포넌트에서 액세스 토큰을 직접 넘겨주도록 합니다.
        // 예: config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

export default client;

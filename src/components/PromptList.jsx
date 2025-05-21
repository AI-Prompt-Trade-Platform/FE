// src/components/PromptList.jsx
import React, { useEffect, useState } from 'react';
import { useAuthApi } from '../hooks/useAuthApi';

export default function PromptList() {
    const { authFetch } = useAuthApi();
    const [prompts, setPrompts] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            try {
                // /api/prompts 엔드포인트에 GET 요청
                const data = await authFetch('/api/prompts', { method: 'GET' });
                setPrompts(data);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, [authFetch]);

    if (error) return <div>데이터 로드 실패: {error}</div>;

    return (
        <ul>
            {prompts.map((p) => (
                <li key={p.id}>{p.title}</li>
            ))}
        </ul>
    );
}

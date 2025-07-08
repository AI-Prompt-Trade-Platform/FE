// src/components/PromptList.jsx
import React, { useEffect, useState } from 'react';
import { promptAPI } from '../services/api';

export default function PromptList() {
    const [prompts, setPrompts] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        (async () => {
            try {
                // 인기 프롬프트 목록 가져오기 
                const data = await promptAPI.getPopularPrompts(100); // 100개 가져오기
                // 응답 구조에 맞게 데이터 추출
                const promptList = data.content || data || [];
                setPrompts(promptList);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, []);

    if (error) return <div>데이터 로드 실패: {error}</div>;

    return (
        <ul>
            {prompts.map((p) => (
                <li key={p.id}>{p.title}</li>
            ))}
        </ul>
    );
}

// src/hooks/useAuthApi.js
import { useAuth0 } from '@auth0/auth0-react';

export function useAuthApi() {
    const { getAccessTokenSilently } = useAuth0();

    /**
     * @param {string} endpoint   호출할 API 경로 (예: '/api/prompts')
     * @param {object} fetchOptions fetch 옵션 (method, body 등)
     * @returns {Promise<any>}      JSON 디코딩된 응답
     */
    const authFetch = async (endpoint, fetchOptions = {}) => {
        // 1) 토큰 획득
        const token = await getAccessTokenSilently();

        // 2) 헤더 설정 병합
        // FormData를 보낼 때는 Content-Type을 설정하지 않음
        const headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${token}`,
        };
        
        // FormData가 아닌 경우에만 Content-Type 설정
        if (!(fetchOptions.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // 3) API 호출
        const res = await fetch(endpoint, {
            ...fetchOptions,
            headers,
        });

        // 4) 에러 처리
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API error ${res.status}: ${errorText}`);
        }

        // 5) JSON 반환
        return res.json();
    };

    return { authFetch };
}

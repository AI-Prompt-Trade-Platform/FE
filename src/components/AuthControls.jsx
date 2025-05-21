// src/components/AuthControls.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function AuthControls() {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isLoading,
    error
  } = useAuth0();

  const handleGetToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Access Token:', token);
      // 필요한 API 호출 시 이 토큰을 Authorization 헤더에 실어 보냅니다.
    } catch (e) {
      console.error('토큰 획득 실패', e);
    }
  };

  if (isLoading) return <div>Loading authentication...</div>;
  if (error)    return <div>Authentication Error: {error.message}</div>;

  return (
      <div>
        {isAuthenticated ? (
            <>
              <p>안녕하세요, {user.name}님! 🙌</p>
              <button onClick={handleGetToken}>
                토큰 조회
              </button>
              <button onClick={() => logout({ returnTo: window.location.origin })}>
                로그아웃
              </button>
            </>
        ) : (
            <button onClick={() => loginWithRedirect()}>
              로그인
            </button>
        )}
      </div>
  );
}

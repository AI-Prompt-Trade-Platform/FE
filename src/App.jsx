import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'; // 서버 API 데이터 관리 라이브러리
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import StarryBackground from './components/mainBackground/StarryBackground.jsx';
import './App.css';
import AuthControls from "./components/AuthControls.jsx";
import { globalStyle } from './components/common/styles/globalStyle/globalStyle';
import { Global } from '@emotion/react'; // css를 컴포넌트 단위로 작성 가능하게 하는 라이브러리
import { Auth0Provider } from '@auth0/auth0-react';


const queryClient = new QueryClient();

const App = () => {
  // process.env 대신 import.meta.env 사용 (Vite 방식)
  // 환경 변수 이름도 VITE_ 접두사를 사용해야 합니다.
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-q64r0n0blzhir6y0.us.auth0.com";
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "7RhbV6ouTCO0KPXRP4w3xUX7hE5k3kfm";

  // redirect_uri는 이미 authorizationParams 안에 window.location.origin으로 잘 설정되어 있습니다.

  // 환경 변수가 올바르게 설정되지 않았을 때 오류를 명확히 표시
  if (!auth0Domain || !auth0ClientId) {
    console.error("Auth0 환경 변수(VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID)가 올바르게 설정되지 않았습니다. .env 파일을 확인해주세요.");
    return (
      <div style={{ padding: '20px', color: 'red', border: '1px solid red', borderRadius: '5px' }}>
        <strong>초기화 오류:</strong> Auth0 설정에 필요한 환경 변수가 누락되었습니다.
        <p>프로젝트 루트의 `.env` 파일에 `VITE_AUTH0_DOMAIN` 및 `VITE_AUTH0_CLIENT_ID`를 추가했는지 확인해주세요.</p>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin, // 이 부분은 이미 잘 되어 있습니다.
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Global styles={globalStyle} />
          <div className='app'>
            {/* AuthControls는 Auth0Provider 내부에서만 작동하므로 Auth0Provider 내부에 있어야 합니다. */}
            {/* Router 컴포넌트는 App 컴포넌트 내에 있으므로 Auth0Provider의 영향을 받습니다. */}
            <Router />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </Auth0Provider>
  );
};


export default App;

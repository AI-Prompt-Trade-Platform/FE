import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'; // 서버 API 데이터 관리 라이브러리
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRouter from './routes/routes';
import StarryBackground from './components/mainBackground/StarryBackground.jsx';
import './App.css';
import AuthControls from "./components/AuthControls.jsx";
import { globalStyle } from './components/common/styles/globalStyle/globalStyle';
import { Global } from '@emotion/react'; // css를 컴포넌트 단위로 작성 가능하게 하는 라이브러리


const queryClient = new QueryClient();

const App = () => {
  // Auth0 관련 환경 변수 확인 및 Auth0Provider 설정은 main.jsx에서 처리하므로 여기서는 제거합니다.
  // const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-q64r0n0blzhir6y0.us.auth0.com";
  // const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "7RhbV6ouTCO0KPXRP4w3xUX7hE5k3kfm";

  // if (!auth0Domain || !auth0ClientId) {
  //   console.error("Auth0 환경 변수(VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID)가 올바르게 설정되지 않았습니다. .env 파일을 확인해주세요.");
  //   return (
  //     <div style={{ padding: '20px', color: 'red', border: '1px solid red', borderRadius: '5px' }}>
  //       <strong>초기화 오류:</strong> Auth0 설정에 필요한 환경 변수가 누락되었습니다.
  //       <p>프로젝트 루트의 `.env` 파일에 `VITE_AUTH0_DOMAIN` 및 `VITE_AUTH0_CLIENT_ID`를 추가했는지 확인해주세요.</p>
  //     </div>
  //   );
  // }

  return (
    // Auth0Provider는 main.jsx에서 이미 감싸고 있으므로 여기서는 제거합니다.
    // <Auth0Provider
    //   domain={auth0Domain}
    //   clientId={auth0ClientId}
    //   authorizationParams={{
    //     redirect_uri: window.location.origin,
    //   }}
    // >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Global styles={globalStyle} />
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    // </Auth0Provider>
  );
};


export default App;

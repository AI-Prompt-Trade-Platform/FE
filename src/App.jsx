import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'; //서버 API데이터 관리 라이브러리
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import StarryBackground from './components/mainBackground/StarryBackground.jsx';
import './App.css'
import AuthControls from "./components/AuthControls.jsx";
import { globalStyle } from './components/common/styles/globalStyle/globalStyle';
import { Global } from '@emotion/react'; //css를 컴포넌트 단위로 작성 가능하게 하는 라이브러리


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Global styles={globalStyle} />
      <StarryBackground />
      <div className='app'>
        <Router />
      </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};


export default App;
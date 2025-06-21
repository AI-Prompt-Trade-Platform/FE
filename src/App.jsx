import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'; // 서버 API 데이터 관리 라이브러리
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRouter from './routes/routes';
import './App.css';
import { globalStyle } from './components/common/styles/globalStyle/globalStyle';
import { Global } from '@emotion/react'; // css를 컴포넌트 단위로 작성 가능하게 하는 라이브러리


const queryClient = new QueryClient();

const App = () => {

  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Global styles={globalStyle} />
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
  );
};


export default App;

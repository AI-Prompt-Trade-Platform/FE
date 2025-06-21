import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MonitoringPage from '../pages/MonitoringPage/MonitoringPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PromptRegisterPage from '../pages/PromptRegisterPage/PromptRegisterPage';
//views 폴더의 .jsx 파일을 라우팅 할 때 사용

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} /> {/* ProtectedRoute 로 감싸서 사용자 인증 필요한 페이지 보호 */}
      <Route path="/prompt-register" element={<ProtectedRoute><PromptRegisterPage /></ProtectedRoute>} />
      {/* 필요한 경우 여기에 다른 라우트를 추가합니다 */}
    </Routes>
  );
};

export default AppRouter;

// 홈화면
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }


// 모니터링
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }

// 위시리스트
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }


// 로그인
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }


//결재창
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
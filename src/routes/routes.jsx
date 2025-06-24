import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import MonitoringPage from '../pages/MonitoringPage/MonitoringPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PromptRegisterPage from '../pages/PromptRegisterPage/PromptRegisterPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import SearchPage from '../pages/SearchPage';
import DiscoverPage from '../pages/DiscoverPage';
import AboutPage from '../pages/AboutPage';
import WishlistPage from '../pages/WishlistPage';
import ProfilePage from '../pages/ProfilePage';
import PaymentPage from '../pages/PaymentPage';
import { useAuth } from '../contexts/AuthContext';

// 조건부 홈 컴포넌트
const ConditionalHome = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 로그인된 사용자는 항상 HomePage 표시
  if (isLoggedIn) {
    return <HomePage />;
  }

  // 미로그인 사용자의 경우
  // 이미 LandingPage를 본 적이 있는지 확인
  const hasVisitedLanding = localStorage.getItem('hasVisitedLanding');
  
  if (!hasVisitedLanding) {
    // 처음 방문하는 사용자는 LandingPage로 이동
    return <Navigate to="/landing" replace />;
  }

  // 이미 LandingPage를 본 사용자는 HomePage 표시
  return <HomePage />;
};

const AppRouter = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="App">
      {!isLandingPage && <Header />}
      <Routes>
        {/* 기본 경로 - 인증 상태에 따라 조건부 라우팅 */}
        <Route path="/" element={<ConditionalHome />} />
        
        {/* 로그인 없이 접근 가능한 페이지들 */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* 로그인이 필요한 페이지들 (ProtectedRoute로 보호) */}
        <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
        <Route path="/prompt-register" element={<ProtectedRoute><PromptRegisterPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default AppRouter;


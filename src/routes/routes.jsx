import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

const AppRouter = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="App">
      {!isLandingPage && <Header />}
      <Routes>
        {/* 로그인 없이 접근 가능한 페이지들 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
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


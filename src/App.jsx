import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'; // 서버 API 데이터 관리 라이브러리
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import SearchPage from './pages/SearchPage'
import DiscoverPage from './pages/DiscoverPage'
import AboutPage from './pages/AboutPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from "./pages/ProfilePage";
import PaymentPage from "./pages/PaymentPage";
import AppRouter from './routes/routes';
import { globalStyle } from './components/common/styles/globalStyle/globalStyle';
import { Global } from '@emotion/react'; // css를 컴포넌트 단위로 작성 가능하게 하는 라이브러리
import './App.css'

const queryClient = new QueryClient();

const App = () => {

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

// todo: 라우팅 어떻게 할건지 고민해보기

  return (
    <div className="App">
      {!isLandingPage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Global styles={globalStyle} />
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
  );
};


export default App
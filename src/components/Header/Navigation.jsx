import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

const Navigation = ({ isMobile = false, onItemClick }) => {
  const { isLoading, isLoggedIn, user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    login();
    if (onItemClick) onItemClick();
  };

  const handleLogout = () => {
    logout();
    if (onItemClick) onItemClick();
  };

  const handleNavClick = (item) => {
    if (item.name === '홈') {
      navigate('/');
    } else if (item.name === '탐색') {
      navigate('/discover');
    } else if (item.name === '소개') {
      navigate('/about');
    } else if (item.name === '프로필') {
      navigate('/profile');
    } else if (item.name === '대시보드') {
      navigate('/monitoring');
    } else if (item.name === '위시리스트') {
      navigate('/wishlist');
    } else if (item.name === '결제') {
      navigate('/payment');
    } else if (item.name === '프롬프트 판매') {
      navigate('/prompt-register');
    }
    if (onItemClick) onItemClick();
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <nav className={`navigation ${isMobile ? 'mobile' : ''}`}>
        <div className="nav-items">
          <div className="nav-item">
            <span className="nav-text">로딩중...</span>
          </div>
        </div>
      </nav>
    );
  }

  // 현재 경로에 따라 활성 상태 결정
  const getActiveState = (itemName) => {
    if (itemName === '홈' && location.pathname === '/') return true;
    if (itemName === '탐색' && location.pathname === '/discover') return true;
    if (itemName === '소개' && location.pathname === '/about') return true;
    if (itemName === '프로필' && location.pathname === '/profile') return true;
    if (itemName === '대시보드' && location.pathname === '/monitoring') return true;
    if (itemName === '위시리스트' && location.pathname === '/wishlist') return true;
    if (itemName === '결제' && location.pathname === '/payment') return true;
    if (itemName === '프롬프트 판매' && location.pathname === '/prompt-register') return true;
    return false;
  };

  const loggedOutItems = [
    { name: '홈', href: '#', active: getActiveState('홈'), icon: '🏠' },
    { name: '탐색', href: '#', active: getActiveState('탐색'), icon: '🔍' },
    { name: '소개', href: '#', active: getActiveState('소개'), icon: '📖' }
  ];

  const loggedInItems = [
    { name: '홈', href: '#', active: getActiveState('홈'), icon: '🏠' },
    { name: '프로필', href: '#', active: getActiveState('프로필'), icon: '👤' },
    { name: '대시보드', href: '#', active: getActiveState('대시보드'), icon: '📊' },
    { name: '위시리스트', href: '#', active: getActiveState('위시리스트'), icon: '❤️' },
    { name: '결제', href: '#', active: getActiveState('결제'), icon: '💳' }
  ];

  const navItems = isLoggedIn ? loggedInItems : loggedOutItems;

  return (
    <nav className={`navigation ${isMobile ? 'mobile' : ''}`}>
      <div className="nav-items">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${item.active ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isMobile && <span className="nav-icon">{item.icon}</span>}
            <span className="nav-text">{item.name}</span>
          </button>
        ))}
        
        {isLoggedIn && (
          <button 
            className={`nav-item sell-prompt-btn ${getActiveState('프롬프트 판매') ? 'active' : ''}`}
            onClick={() => handleNavClick({ name: '프롬프트 판매' })}
          >
            {isMobile && <span className="nav-icon">💰</span>}
            <span className="nav-text">프롬프트 판매</span>
          </button>
        )}
        
        {!isLoggedIn ? (
          <button className="nav-item login-btn" onClick={handleLogin}>
            {isMobile && <span className="nav-icon">🔐</span>}
            <span className="nav-text">로그인</span>
          </button>
        ) : (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{user?.name || user?.email || '사용자'}</span>
            </div>
            <button className="nav-item logout-btn" onClick={handleLogout}>
              {isMobile && <span className="nav-icon">🚪</span>}
              <span className="nav-text">로그아웃</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 
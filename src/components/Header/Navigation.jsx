import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

const Navigation = ({ isMobile = false, onItemClick }) => {
  const { isLoading, isLoggedIn, user, login, logout } = useAuth();
  const navigate = useNavigate();

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

  const loggedOutItems = [
    { name: '홈', href: '#', active: true, icon: '🏠' },
    { name: '탐색', href: '#', icon: '🔍' },
    { name: '소개', href: '#', icon: '📖' }
  ];

  const loggedInItems = [
    { name: '홈', href: '#', active: true, icon: '🏠' },
    { name: '프로필', href: '#', icon: '👤' },
    { name: '대시보드', href: '#', icon: '📊' },
    { name: '위시리스트', href: '#', icon: '❤️' },
    { name: '결제', href: '#', icon: '💳' }
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
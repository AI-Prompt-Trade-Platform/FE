import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Navigation.css';

const Navigation = ({ isMobile = false, onItemClick }) => {
    const { isLoggedIn, user, login, logout } = useAuth();

    const handleLogin = () => {
        // 실제 로그인 로직 대신 데모용 로그인
        login({ name: '김사용자', email: 'user@example.com' });
        if (onItemClick) onItemClick();
    };

    const handleLogout = () => {
        logout();
        if (onItemClick) onItemClick();
    };

    const handleNavClick = () => {
        if (onItemClick) onItemClick();
    };

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
                    <a
                        key={index}
                        href={item.href}
                        className={`nav-item ${item.active ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        {isMobile && <span className="nav-icon">{item.icon}</span>}
                        <span className="nav-text">{item.name}</span>
                    </a>
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
                            <span className="user-name">{user?.name}</span>
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
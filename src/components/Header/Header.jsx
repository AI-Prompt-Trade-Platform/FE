import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import SearchBar from './SearchBar';
import Navigation from './Navigation';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="navbar">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <span>Prumpt</span>
          <span className="version">2.0</span>
        </div>
        
        <div className="desktop-nav">
          <SearchBar />
          <Navigation />
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="메뉴 토글"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-search">
          <SearchBar onSearch={() => setIsMobileMenuOpen(false)} />
        </div>
        <div className="mobile-nav">
          <Navigation isMobile={true} onItemClick={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <div className="footer-logo-container">
            <svg className="footer-logo" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
              {/* 말풍선 아이콘 */}
              <g transform="translate(5, 8)">
                {/* 검은색 말풍선 */}
                <path d="M8 4 C4 4 1 7 1 11 C1 15 4 18 8 18 L12 18 C16 18 19 15 19 11 C19 7 16 4 12 4 Z" 
                      fill="#000" stroke="#000" strokeWidth="2"/>
                <path d="M6 20 L8 18 L4 18 Z" fill="#000"/>
                
                {/* 빨간색 말풍선 */}
                <path d="M12 2 C8 2 5 5 5 9 C5 13 8 16 12 16 L16 16 C20 16 23 13 23 9 C23 5 20 2 16 2 Z" 
                      fill="#ff4757" stroke="#ff4757" strokeWidth="2"/>
                <path d="M10 18 L12 16 L8 16 Z" fill="#ff4757"/>
              </g>
              
              {/* PRUMPT 2.0 텍스트 */}
              <text x="35" y="25" fontSize="14" fontWeight="bold" fill="#000">PRUMPT</text>
            </svg>
            <p>&copy; {currentYear} PRUMPT 2.0. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
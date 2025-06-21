import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  // 마우스 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 로딩 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 페이즈 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    navigate('/');
  };

  const handleDiscoverClick = () => {
    navigate('/discover');
  };

  return (
    <div className={`quantum-landing ${isLoaded ? 'loaded' : ''}`}>
      {/* 차원 포털 배경 */}
      <div className="dimensional-portal">
        <div className="portal-core" 
             style={{
               '--mouse-x': `${mousePosition.x}%`,
               '--mouse-y': `${mousePosition.y}%`
             }}>
          <div className="quantum-rings">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`quantum-ring ring-${i + 1}`}></div>
            ))}
          </div>
          <div className="energy-vortex"></div>
        </div>
        
        {/* 떠다니는 데이터 파편들 */}
        <div className="data-fragments">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`data-fragment fragment-${i + 1}`}>
              <div className="fragment-core"></div>
              <div className="fragment-trail"></div>
            </div>
          ))}
        </div>
        
        {/* 신경망 연결선 */}
        <div className="neural-web">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`neural-connection connection-${i + 1}`}></div>
          ))}
        </div>
        
                 {/* 저작권 문구 */}
         <div className="copyright-overlay">
           <div className="copyright-logo">
             <svg className="prumpt-logo" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
               {/* 말풍선 아이콘 */}
               <g transform="translate(2, 2)">
                 {/* 뒤쪽 말풍선 */}
                 <path d="M8 4 C4 4 1 7 1 11 C1 15 4 18 8 18 L12 18 C16 18 19 15 19 11 C19 7 16 4 12 4 Z" 
                       fill="rgba(120, 219, 255, 0.8)" stroke="rgba(120, 219, 255, 0.8)" strokeWidth="1"/>
                 <path d="M6 20 L8 18 L4 18 Z" fill="rgba(120, 219, 255, 0.8)"/>
                 
                 {/* 앞쪽 말풍선 */}
                 <path d="M12 2 C8 2 5 5 5 9 C5 13 8 16 12 16 L16 16 C20 16 23 13 23 9 C23 5 20 2 16 2 Z" 
                       fill="rgba(255, 119, 198, 0.8)" stroke="rgba(255, 119, 198, 0.8)" strokeWidth="1"/>
                 <path d="M10 18 L12 16 L8 16 Z" fill="rgba(255, 119, 198, 0.8)"/>
               </g>
                              {/* PRUMPT 2.0 텍스트 */}
               <text x="30" y="16" fontSize="10" fontWeight="bold" fill="#ffffff" stroke="rgba(120, 219, 255, 0.5)" strokeWidth="0.2">PRUMPT</text>
             </svg>
           </div>
           <p className="copyright-text">
             © 2025 PRUMPT 2.0. All rights reserved.
           </p>
         </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="quantum-content">
        <div className="reality-distortion">
          {/* 위상 인디케이터 */}
          <div className="phase-indicator">
            <div className={`phase-dot ${currentPhase === 0 ? 'active' : ''}`}></div>
            <div className={`phase-dot ${currentPhase === 1 ? 'active' : ''}`}></div>
            <div className={`phase-dot ${currentPhase === 2 ? 'active' : ''}`}></div>
          </div>

          {/* 브랜드 로고 */}
          <div className="quantum-brand">
            <div className="brand-symbol">
              <div className="symbol-core"></div>
              <div className="symbol-orbit orbit-1"></div>
              <div className="symbol-orbit orbit-2"></div>
              <div className="symbol-orbit orbit-3"></div>
            </div>
            <h1 className="brand-name">
              <span className="letter-p">P</span>
              <span className="letter-r">r</span>
              <span className="letter-u">u</span>
              <span className="letter-m">m</span>
              <span className="letter-p2">p</span>
              <span className="letter-t">t</span>
              <span className="version">2.0</span>
            </h1>
          </div>

          {/* 동적 타이틀 */}
          <div className="quantum-title">
            <div className={`title-phase phase-${currentPhase}`}>
              {currentPhase === 0 && (
                <>
                  <h2 className="phase-text">AI 프롬프트의 새로운 차원</h2>
                  <h3 className="phase-subtitle">Prumpt 2.0과 함께하는 창의적 혁신</h3>
                </>
              )}
              {currentPhase === 1 && (
                <>
                  <h2 className="phase-text">스마트한 프롬프트 마켓</h2>
                  <h3 className="phase-subtitle">당신의 아이디어를 현실로</h3>
                </>
              )}
              {currentPhase === 2 && (
                <>
                  <h2 className="phase-text">미래를 만드는 AI 플랫폼</h2>
                  <h3 className="phase-subtitle">Prumpt 2.0의 무한한 가능성</h3>
                </>
              )}
            </div>
          </div>

          {/* 양자 통계 */}
          <div className="quantum-stats">
            <div className="stat-quantum">
              <div className="stat-energy"></div>
              <div className="stat-number">50K+</div>
              <div className="stat-label">프롬프트 컬렉션</div>
            </div>
            <div className="stat-quantum">
              <div className="stat-energy"></div>
              <div className="stat-number">100K+</div>
              <div className="stat-label">활성 사용자</div>
            </div>
            <div className="stat-quantum">
              <div className="stat-energy"></div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">만족도</div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="quantum-actions">
            <button className="portal-button primary" onClick={handleStartClick}>
              <div className="button-energy"></div>
              <span className="button-text">포털 진입</span>
              <div className="button-particles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`button-particle particle-${i + 1}`}></div>
                ))}
              </div>
            </button>
            
            <button className="portal-button secondary" onClick={handleDiscoverClick}>
              <div className="button-energy"></div>
              <span className="button-text">차원 탐색</span>
              <div className="button-ripple"></div>
            </button>
          </div>

          {/* 신비로운 메시지 */}
          <div className="mystical-message">
            <div className="message-glow"></div>
            <p className="message-text">
              "Prumpt 2.0과 함께 창의력의 새로운 경계를 경험하세요"
            </p>
            <div className="message-runes">
              <span className="rune">◊</span>
              <span className="rune">◈</span>
              <span className="rune">◊</span>
            </div>
          </div>
        </div>
      </div>

      {/* 차원 경계선 */}
      <div className="dimensional-borders">
        <div className="border-line border-top"></div>
        <div className="border-line border-right"></div>
        <div className="border-line border-bottom"></div>
        <div className="border-line border-left"></div>
        <div className="border-corner corner-tl"></div>
        <div className="border-corner corner-tr"></div>
        <div className="border-corner corner-bl"></div>
        <div className="border-corner corner-br"></div>
      </div>

      {/* 양자 노이즈 */}
      <div className="quantum-noise"></div>
      
      {/* 홀로그램 스캔 라인 */}
      <div className="hologram-scanlines"></div>
    </div>
  );
};

export default LandingPage; 
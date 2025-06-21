import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StarryBackground from '../components/Background/StarryBackground';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 무료로 시작하기 버튼 클릭 핸들러
  const handleStartFree = () => {
    login(); // 로그인 페이지로 이동
  };

  // 프롬프트 둘러보기 버튼 클릭 핸들러
  const handleExplorePrompts = () => {
    navigate('/'); // 홈페이지로 이동
  };

  // 마우스 위치 추적
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 스크롤 기반 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'AI 지능 증폭',
      description: '인공지능의 잠재력을 최대한 끌어내는 정교한 프롬프트들',
      detail: '수천 명의 AI 전문가들이 검증한 고품질 프롬프트로 AI의 성능을 극대화하세요.'
    },
    {
      icon: '🚀',
      title: '창의성 가속화',
      description: '상상력의 한계를 뛰어넘는 혁신적인 아이디어 생성',
      detail: '예술, 비즈니스, 기술 분야의 창의적 솔루션을 빠르게 발견하세요.'
    },
    {
      icon: '🌐',
      title: '글로벌 협업',
      description: '전 세계 크리에이터들과 함께하는 지식 공유 생태계',
      detail: '다양한 문화와 관점이 만나 새로운 가치를 창조하는 플랫폼입니다.'
    },
    {
      icon: '⚡',
      title: '실시간 진화',
      description: 'AI 기술 발전과 함께 끊임없이 업데이트되는 프롬프트',
      detail: '최신 AI 모델과 기술 트렌드를 반영한 프롬프트를 실시간으로 제공합니다.'
    }
  ];

  const stats = [
    { number: '50K+', label: '활성 사용자', icon: '👥' },
    { number: '100K+', label: 'AI 프롬프트', icon: '🎯' },
    { number: '99.9%', label: '만족도', icon: '⭐' },
    { number: '24/7', label: '지원 서비스', icon: '🛡️' }
  ];

  return (
    <div className="about-page">
      <StarryBackground />
      
      {/* 마우스 트레일 효과 */}
      <div 
        className="mouse-trail"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* 히어로 섹션 */}
      <section className="hero-section scroll-section" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span>AI Revolution 2024</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">미래의 창조자들을 위한</span>
            <span className="title-highlight">AI 프롬프트 마켓플레이스</span>
            <span className="title-line">Prumpt 2.0</span>
          </h1>
          
          <p className="hero-description">
            인공지능과 인간의 창의성이 만나는 곳. 
            상상할 수 있는 모든 것을 현실로 만드는 혁신적인 플랫폼에서 
            당신만의 AI 어시스턴트를 완성하세요.
          </p>
          
          <div className="hero-actions">
            <button 
              className="cta-primary"
              onClick={handleStartFree}
            >
              <span>지금 시작하기</span>
              <div className="button-particles"></div>
            </button>
            <button 
              className="cta-secondary"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              <span>더 알아보기</span>
              <svg className="arrow-icon" viewBox="0 0 24 24">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="float-item ai-chip">
              <span>🤖</span>
              <div className="chip-glow"></div>
            </div>
            <div className="float-item creativity-orb">
              <span>💡</span>
              <div className="orb-pulse"></div>
            </div>
            <div className="float-item innovation-cube">
              <span>🚀</span>
              <div className="cube-rotation"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className={`stats-section scroll-section ${isVisible.stats ? 'visible' : ''}`} id="stats">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ '--delay': `${index * 0.1}s` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className={`features-section scroll-section ${isVisible.features ? 'visible' : ''}`} id="features">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-accent">혁신적인 기능들</span>
          </h2>
          <p className="section-subtitle">
            AI의 무한한 가능성을 현실로 만드는 Prumpt 2.0의 핵심 기능들을 만나보세요
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ '--index': index }}
            >
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
                <div className="icon-ripple"></div>
              </div>
              
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <p className="feature-detail">{feature.detail}</p>
              
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* 비전 섹션 */}
      <section className={`vision-section scroll-section ${isVisible.vision ? 'visible' : ''}`} id="vision">
        <div className="vision-content">
          <div className="vision-text">
            <h2 className="vision-title">
              <span className="gradient-text">미래를 함께 만들어가는</span>
              <span className="gradient-text">AI 생태계</span>
            </h2>
            
            <div className="vision-description">
              <p>
                Prumpt 2.0은 단순한 마켓플레이스를 넘어서, 
                인공지능과 인간이 협력하여 새로운 가치를 창조하는 
                혁신적인 플랫폼입니다.
              </p>
              
              <p>
                우리는 모든 사람이 AI의 힘을 활용하여 
                자신만의 독창적인 작품과 솔루션을 만들 수 있는 
                미래를 꿈꿉니다.
              </p>
            </div>
            
            <div className="vision-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🌟</span>
                <span>창의성과 기술의 융합</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🤝</span>
                <span>글로벌 협업 생태계</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🔮</span>
                <span>무한한 가능성의 실현</span>
              </div>
            </div>
          </div>
          
          <div className="vision-visual">
            <div className="cosmic-sphere">
              <div className="sphere-core"></div>
              <div className="sphere-ring ring-1"></div>
              <div className="sphere-ring ring-2"></div>
              <div className="sphere-ring ring-3"></div>
              <div className="floating-dots">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="dot" style={{ '--i': i }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className={`cta-section scroll-section ${isVisible.cta ? 'visible' : ''}`} id="cta">
        <div className="cta-content">
          <h2 className="cta-title">
            <span className="electric-text">지금 바로 시작하세요</span>
          </h2>
          
          <p className="cta-description">
            수백만 명의 크리에이터들과 함께 AI의 새로운 시대를 열어가세요
          </p>
          
          <div className="cta-buttons">
            <button 
              className="cta-button primary"
              onClick={handleStartFree}
            >
              <span>무료로 시작하기</span>
              <div className="button-energy"></div>
            </button>
            
            <button 
              className="cta-button secondary"
              onClick={handleExplorePrompts}
            >
              <span>프롬프트 둘러보기</span>
            </button>
          </div>
        </div>
        
        <div className="cta-background">
          <div className="energy-waves">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="wave" style={{ '--i': i }}></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/');
    };

    return (
        <div className="landing-page">
            <div className="landing-background">
                <div className="neural-network">
                    <div className="node node-1"></div>
                    <div className="node node-2"></div>
                    <div className="node node-3"></div>
                    <div className="node node-4"></div>
                    <div className="node node-5"></div>
                    <div className="connection connection-1"></div>
                    <div className="connection connection-2"></div>
                    <div className="connection connection-3"></div>
                    <div className="connection connection-4"></div>
                </div>
                <div className="hologram-grid"></div>
            </div>

            <div className="landing-content">
                <div className="landing-text">
                    <div className="ai-badge">
                        <span className="badge-icon">🤖</span>
                        <span>AI-POWERED</span>
                    </div>
                    <h1 className="glitch-text" data-text="Prumpt 2.0">
                        Prumpt 2.0
                    </h1>
                    <p className="neon-subtitle">
                        차세대 AI 프롬프트 마켓플레이스
                    </p>
                    <p className="landing-description">
                        최첨단 인공지능과 함께하는 창의적 혁신의 시작점
                    </p>
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">AI 프롬프트</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">활성 사용자</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">만족도</span>
                        </div>
                    </div>
                </div>

                <div className="landing-actions">
                    <button className="cta-button primary-glow" onClick={handleStartClick}>
                        <span className="button-text">지금 시작하기</span>
                        <div className="button-glow"></div>
                    </button>
                </div>
            </div>

            <div className="landing-visual">
                <div className="ai-orb">
                    <div className="orb-core"></div>
                    <div className="orb-ring ring-1"></div>
                    <div className="orb-ring ring-2"></div>
                    <div className="orb-ring ring-3"></div>
                    <div className="energy-particles">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                        <div className="particle particle-4"></div>
                        <div className="particle particle-5"></div>
                    </div>
                </div>
                <div className="floating-elements">
                    <div className="tech-card card-ai">
                        <div className="card-icon">🧠</div>
                        <span>Neural AI</span>
                    </div>
                    <div className="tech-card card-ml">
                        <div className="card-icon">⚡</div>
                        <span>Machine Learning</span>
                    </div>
                    <div className="tech-card card-future">
                        <div className="card-icon">🚀</div>
                        <span>Future Tech</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
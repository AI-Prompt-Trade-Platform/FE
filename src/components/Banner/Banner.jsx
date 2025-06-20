import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Banner.css';

const Banner = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    const handleStartClick = () => {
        // 이미 홈페이지에 있다면 페이지 새로고침, 아니면 홈페이지로 이동
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    const handleExploreClick = () => {
        // 프롬프트 탐색 섹션으로 스크롤
        const promptSection = document.querySelector('.prompt-section');
        if (promptSection) {
            promptSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="banner">
            <div className="banner-background">
                <div className="gradient-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>
                <div className="tech-grid"></div>
            </div>

            <div className="banner-content">
                <div className="banner-text">
                    <div className="ai-tag">
                        <span className="tag-icon">⚡</span>
                        <span>AI MARKETPLACE</span>
                    </div>
                    <h1 className="banner-title">
                        {isLoggedIn ? (
                            <>
                                안녕하세요, {user?.name || '사용자'}님! <br />
                                <span className="highlight-text">새로운 프롬프트를 발견해보세요</span>
                            </>
                        ) : (
                            <>
                                최고의 AI 프롬프트를 <br />
                                <span className="highlight-text">발견하세요</span>
                            </>
                        )}
                    </h1>
                    <p className="banner-subtitle">
                        {isLoggedIn
                            ? "맞춤형 AI 프롬프트로 더 나은 결과를 만들어보세요"
                            : "Prumpt 2.0에서 창의적인 솔루션과 혁신적인 아이디어를 만나보세요"
                        }
                    </p>
                </div>

                <div className="banner-actions">
                    {!isLoggedIn ? (
                        <button className="btn-primary" onClick={handleStartClick}>
                            <span>지금 시작하기</span>
                            <div className="btn-shine"></div>
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={handleExploreClick}>
                            <span>프롬프트 탐색하기</span>
                            <div className="btn-shine"></div>
                        </button>
                    )}
                </div>
            </div>

            <div className="banner-visual">
                <div className="floating-icons">
                    <div className="icon-card card-1">
                        <span>🤖</span>
                    </div>
                    <div className="icon-card card-2">
                        <span>💡</span>
                    </div>
                    <div className="icon-card card-3">
                        <span>🚀</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
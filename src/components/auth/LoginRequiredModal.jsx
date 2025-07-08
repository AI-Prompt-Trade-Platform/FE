import React, { useEffect, useState } from 'react';
import './LoginRequiredModal.css';

const LoginRequiredModal = ({ isOpen, onClose, onLogin }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 배경 스크롤 막기
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // 컴포넌트 언마운트 시 스크롤 복원
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleLoginClick = () => {
    handleClose();
    if (onLogin) {
      onLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`login-required-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`login-required-modal ${isClosing ? 'closing' : ''}`}>
        <div className="modal-icon">
          <div className="lock-container">
            <div className="lock-body">
              <div className="lock-shackle"></div>
            </div>
          </div>
        </div>
        
        <div className="modal-content">
          <h2 className="modal-title">로그인이 필요해요</h2>
          <p className="modal-description">
            프롬프트 상세 정보를 확인하려면<br />
            로그인을 먼저 해주세요!
          </p>
        </div>

        <div className="modal-actions">
          <button 
            className="login-button" 
            onClick={handleLoginClick}
          >
            <span className="button-icon">🚀</span>
            로그인하기
          </button>
          <button 
            className="cancel-button" 
            onClick={handleClose}
          >
            나중에
          </button>
        </div>

        <button 
          className="close-button" 
          onClick={handleClose}
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 배경 파티클 효과 */}
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal; 
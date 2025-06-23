import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './AlertModal.css';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info', confirmText = '확인' }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // 배경 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 배경 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="alert-icon success">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      case 'error':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="alert-icon error">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="alert-icon warning">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default:
        return (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="alert-icon info">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div 
      className={`alert-modal-overlay ${isClosing ? 'fade-out' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`alert-modal-content ${type} ${isClosing ? 'slide-out' : 'slide-in'}`}>
        <div className="alert-modal-header">
          <div className="alert-icon-container">
            {getIcon()}
          </div>
          {title && <h2 className="alert-title">{title}</h2>}
        </div>
        
        <div className="alert-modal-body">
          <p className="alert-message">{message}</p>
        </div>
        
        <div className="alert-modal-footer">
          <button 
            className={`alert-confirm-btn ${type}`}
            onClick={handleClose}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
        
        {/* 파티클 효과 (성공 알림용) */}
        {type === 'success' && (
          <div className="success-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`}></div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default AlertModal; 
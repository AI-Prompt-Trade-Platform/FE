import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const { loginWithRedirect } = useAuth0();

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>로그인이 필요합니다</h2>
        <p>이 페이지에 접근하려면 로그인이 필요합니다. 로그인해주세요.</p>
        <button className="login-modal-button" onClick={() => loginWithRedirect()}>
          로그인 / 회원가입
        </button>
        <button className="login-modal-close-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginModal; 
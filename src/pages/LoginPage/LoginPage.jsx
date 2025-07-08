import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import StarryBackground from '../../components/Background/StarryBackground';

// 로그인 버튼 스니펫 (홈화면에 로그인버튼과 함께 옮겨야함)===================
const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // 사용자가 로그인되어 있으면 MonitoringPage로 리디렉션 (나중에 홈 화면으로 리다이렉션 하도록 수정 필요)
      navigate('/monitoring');
    }
  }, [isAuthenticated, navigate]);
// ===============================================================

  return (
    <div className="login-page-container">
      <StarryBackground />
      <h1 className="login-title" data-text="Prumpt에 오신 것을 환영합니다!">Prumpt에 오신 것을 환영합니다!</h1>
      <p className="login-description">로그인하여 프롬프트의 세계를 탐험해보세요.</p>
      
      {/* 로그인 버튼만 홈화면에 추가하면 됨 =================================== */}
      {!isAuthenticated && (
        <button
          className="login-button"
          onClick={() => loginWithRedirect()}
        >
          로그인 / 회원가입
        </button>
      )}
      {/* =============================================================== */}

    </div>
  );
};

export default LoginPage; 
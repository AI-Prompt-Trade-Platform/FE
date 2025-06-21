import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, isLoading]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    //사용자가 로그인 모달을 닫아도 아무것도 렌더링하지 않음.
  };

  if (isLoading) {
    // 인증 상태를 로드 중일 때 로딩 스피너 등을 표시할 수 있습니다.
    return <div>Loading authentication...</div>;
  }

  if (isAuthenticated) {
    return children;
  } else {
    return <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} />;
  }
};

export default ProtectedRoute; 
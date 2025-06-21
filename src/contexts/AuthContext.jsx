import React, { createContext, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Auth0 토큰을 API 클라이언트에 설정
  useEffect(() => {
    const setToken = async () => {
      try {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
          localStorage.setItem('authToken', token);
        } else {
          setAuthToken(null);
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('토큰 설정 실패:', error);
      }
    };

    if (!isLoading) {
      setToken();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const login = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ 
      logoutParams: { returnTo: window.location.origin } 
    });
  };

  const value = {
    isLoading,
    isLoggedIn: isAuthenticated,
    user,
    login,
    logout: handleLogout,
    getAccessTokenSilently,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
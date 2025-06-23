import React, { createContext, useContext, useState } from 'react';
import AlertModal from '../components/common/AlertModal/AlertModal';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: '확인'
  });

  const showAlert = ({ title, message, type = 'info', confirmText = '확인' }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      confirmText
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  // 편의 메서드들
  const showSuccess = (message, title = '성공') => {
    showAlert({ title, message, type: 'success' });
  };

  const showError = (message, title = '오류') => {
    showAlert({ title, message, type: 'error' });
  };

  const showWarning = (message, title = '경고') => {
    showAlert({ title, message, type: 'warning' });
  };

  const showInfo = (message, title = '알림') => {
    showAlert({ title, message, type: 'info' });
  };

  const contextValue = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideAlert
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}; 
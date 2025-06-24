import React, { createContext, useContext, useState } from 'react';
import AlertModal from '../components/common/AlertModal/AlertModal';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: '확인',
    cancelText: null,
    onConfirm: null,
    onCancel: null
  });

  const showAlert = ({ title, message, type = 'info', confirmText = '확인', cancelText = null, onConfirm = null, onCancel = null }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
      onCancel: null,
      cancelText: null
    }));
  };

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    hideAlert();
  };

  const handleCancel = () => {
    if (alert.onCancel) {
      alert.onCancel();
    }
    hideAlert();
  };

  // 편의 메서드들
  const showSuccess = (message, title = '성공', onConfirm = null) => {
    showAlert({ title, message, type: 'success', onConfirm });
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

  const showConfirm = (message, title = '확인', onConfirm = null, onCancel = null) => {
    showAlert({ 
      title, 
      message, 
      type: 'warning', 
      confirmText: '확인', 
      cancelText: '취소',
      onConfirm,
      onCancel
    });
  };

  const contextValue = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
    handleConfirm,
    handleCancel
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={hideAlert}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
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
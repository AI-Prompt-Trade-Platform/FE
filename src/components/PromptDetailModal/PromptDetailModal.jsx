import React, { useState, useEffect } from 'react';
import './PromptDetailModal.css';

const PromptDetailModal = ({ prompt, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 모달이 마운트될 때 fadeIn 애니메이션을 위해 잠시 지연을 줍니다.
    // (이미 CSS에 정의되어 있지만, 혹시 모를 타이밍 문제 방지)
    const timer = setTimeout(() => {
      // 여기에 필요한 초기화 로직을 추가할 수 있습니다.
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // 애니메이션 지속 시간 (0.3s) 후에 실제 onClose 콜백을 호출합니다.
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  if (!prompt) {
    return null;
  }

  return (
    <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>×</button>
        <h2 className="modal-title">{prompt.title}</h2>
        <p className="modal-description">{prompt.description}</p>
        <div className="modal-details">
          <p><strong>카테고리:</strong> {prompt.category}</p>
          <p><strong>평점:</strong> {prompt.rating} ⭐</p>
          <p><strong>가격:</strong> {prompt.price === 0 ? '무료' : `₩${prompt.price.toLocaleString()}`}</p>
          <p><strong>작가:</strong> {prompt.author}</p>
          <p><strong>다운로드:</strong> {prompt.downloads}</p>
          <div className="modal-tags">
            {prompt.tags?.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
        {/* 추가적인 상세 정보나 구매 버튼 등을 여기에 추가할 수 있습니다. */}
      </div>
    </div>
  );
};

export default PromptDetailModal; 
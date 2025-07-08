import React, { useState } from 'react';
import PromptCard from '../PromptCard/PromptCard';
import PromptDetailModal from '../PromptDetailModal/PromptDetailModal';
import './PromptCardList.css';

const PromptCardList = ({ prompts }) => {
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  // 프롬프트 카드 클릭 핸들러
  const handlePromptClick = (prompt) => {
    setSelectedPromptId(prompt.id);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setSelectedPromptId(null);
  };

  // 구매 성공 핸들러
  const handlePurchaseSuccess = (promptId) => {
    console.log('구매 성공:', promptId);
    // 필요시 상태 업데이트 로직 추가
  };

  return (
    <>
      <div className="prompt-card-list">
        {prompts.map(prompt => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            onClick={handlePromptClick} 
          />
        ))}
      </div>

      {/* 프롬프트 상세 모달 */}
      {selectedPromptId && (
        <PromptDetailModal
          promptId={selectedPromptId}
          onClose={handleModalClose}
          onPurchase={handlePurchaseSuccess}
        />
      )}
    </>
  );
};

export default PromptCardList; 
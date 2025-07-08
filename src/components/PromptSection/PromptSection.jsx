import React from 'react';
import PromptCard from '../PromptCard/PromptCard';
import './PromptSection.css';

const PromptSection = ({prompts = [], showMore = false, onCardClick }) => {
  // prompts가 배열이 아닌 경우 빈 배열로 설정
  const safePrompts = Array.isArray(prompts) ? prompts : [];

  return (
    <section className="prompt-section">
      <div className="section-header">
        {showMore && (
          <button className="view-all-button">
            전체보기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="cards-container">
        {safePrompts.length > 0 ? (
          safePrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onClick={() => onCardClick?.(prompt.id)} />
          ))
        ) : (
          <div className="no-prompts">
            <p>표시할 프롬프트가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromptSection; 
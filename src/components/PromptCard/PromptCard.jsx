import React from 'react';
import './PromptCard.css';

const PromptCard = ({ prompt, onClick }) => {
  const {
    id,
    title,
    description,
    category,
    rating,
    price,
    author,
    ownerProfileName,
    thumbnail,
    thumbnailImageUrl,
    tags,
    downloads,
    aiInspectionRate
  } = prompt;

  const handleClick = () => {
    if (onClick) {
      onClick(prompt);
    }
  };

  // AI 등급 변환 함수 - A등급만 표시
  const getAIGrade = (rate) => {
    if (!rate) return null;
    
    // 다양한 형태의 AI 등급 데이터 처리
    const rateStr = rate.toString().toLowerCase();
    
    // "A", "excellent", "A - 이유" 등의 형태 모두 처리
    if (rateStr.startsWith('a') || rateStr.includes('excellent')) {
      return 'EXCELLENT';
    }
    
    // 첫 글자가 'A'인 경우도 처리
    const firstChar = rate.toString().charAt(0).toUpperCase();
    return firstChar === 'A' ? 'EXCELLENT' : null;
  };

  // AI 등급 클래스 결정 함수
  const getGradeClass = (rate) => {
    if (!rate) return '';
    
    const rateStr = rate.toString().toLowerCase();
    
    // "A", "excellent", "A - 이유" 등의 형태 모두 처리
    if (rateStr.startsWith('a') || rateStr.includes('excellent')) {
      return 'grade-excellent';
    }
    
    const firstChar = rate.toString().charAt(0).toUpperCase();
    return firstChar === 'A' ? 'grade-excellent' : '';
  };

  const aiGrade = getAIGrade(aiInspectionRate);
  


  return (
    <div className="prompt-card" onClick={handleClick}>
      <div className="card-thumbnail">
        {(thumbnailImageUrl || thumbnail) ? (
          <img src={thumbnailImageUrl || thumbnail} alt={title} />
        ) : (
          <div className="placeholder-thumbnail">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
          </div>
        )}
        {aiGrade && (
          <div className={`card-ai-grade ${getGradeClass(aiInspectionRate)}`}>
            AI {aiGrade}
          </div>
        )}
        <div className="card-category">{category || '기타'}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title || '제목 없음'}</h3>
        <p className="card-description">{description || '설명이 없습니다.'}</p>
        
        <div className="card-tags">
          {tags?.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
        
        <div className="card-footer">
          <div className="card-info">
            <div className="rating">
              <svg className="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span>{rating || 0}</span>
            </div>
            <div className="downloads">{(downloads || 0).toLocaleString()}+ 다운로드</div>
          </div>
          <div className="card-price">
            {(price || 0) === 0 ? '무료' : `₩${(price || 0).toLocaleString()}`}
          </div>
        </div>
        
        <div className="card-author">
          by {author?.name || ownerProfileName || author || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 
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
    tags,
    downloads
  } = prompt;

  const handleClick = () => {
    if (onClick) {
      onClick(prompt);
    }
  };

  return (
    <div className="prompt-card" onClick={handleClick}>
      <div className="card-thumbnail">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className="placeholder-thumbnail">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
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
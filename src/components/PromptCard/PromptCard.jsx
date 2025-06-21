import React from 'react';
import './PromptCard.css';

const PromptCard = ({ prompt, onCardClick }) => {
  const {
    id,
    title,
    description,
    category,
    rating,
    price,
    author,
    thumbnail,
    tags,
    downloads
  } = prompt;

  console.log('Rendering PromptCard with prompt:', prompt); //디버깅용 (프롬프트 데이터 출력)

  const handleClick = () => {
    if (onCardClick) {
      onCardClick(prompt);
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
        <div className="card-category">{category}</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        
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
              <span>{rating}</span>
            </div>
            <div className="downloads">{downloads}+ 다운로드</div>
          </div>
          <div className="card-price">
            {price === 0 ? '무료' : `₩${price.toLocaleString()}`}
          </div>
        </div>
        
        <div className="card-author">
          by {author}
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 
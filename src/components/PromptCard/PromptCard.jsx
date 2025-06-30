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

  // AI 등급 파싱 및 변환 함수 - 모든 등급 지원 (S, A, B, C, D)
  const parseAIGrade = (rate) => {
    if (!rate) return { grade: null, displayName: null };
    
    let rateStr = rate.toString().trim();
    
    // 백틱 문자 제거 (`A 주요 객체와 스타일이 잘 구현됨` -> A 주요 객체와 스타일이 잘 구현됨)
    rateStr = rateStr.replace(/`/g, '').trim();
    
    let grade = null;
    
    // 1. 대괄호 패턴 체크: [A][이유]
    const bracketMatch = rateStr.match(/\[([A-Z])\]\[.+?\]/);
    if (bracketMatch) {
      grade = bracketMatch[1].toUpperCase();
          } else {
        // 2. 공백 기반 파싱: "X 시각적 요소가 아님" 또는 "A 주요 요소들이 프롬프트와 잘 일치함"
        const firstChar = rateStr.charAt(0).toUpperCase();
        
        // 등급이 유효한지 확인 (S, A, B, C, D, X 중 하나)
        if (['S', 'A', 'B', 'C', 'D', 'X'].includes(firstChar)) {
          grade = firstChar;
        } else {
          // 3. 콜론 기반 파싱 시도: "등급: 이유" 형태
          const colonMatch = rateStr.match(/([A-ZX])\s*[:：]\s*(.+)/i);
          if (colonMatch) {
            const potentialGrade = colonMatch[1].toUpperCase();
            if (['S', 'A', 'B', 'C', 'D', 'X'].includes(potentialGrade)) {
              grade = potentialGrade;
            }
          } else {
            // 4. 단어 단위로 분리하여 등급 찾기
            const words = rateStr.split(/\s+/);
            
            for (let i = 0; i < words.length; i++) {
              const word = words[i].toUpperCase();
              if (['S', 'A', 'B', 'C', 'D', 'X'].includes(word)) {
                grade = word;
                break;
              }
            }
          }
        }
      }
    
    // 등급에 따른 표시명 설정
    const gradeDisplayMap = {
      'S': 'PREMIUM',
      'A': 'EXCELLENT', 
      'B': 'GOOD',
      'C': 'FAIR',
      'D': 'BASIC',
      'X': 'NOT RATED'
    };
    
    return {
      grade: grade,
      displayName: grade ? gradeDisplayMap[grade] : null
    };
  };

  // AI 등급 클래스 결정 함수
  const getGradeClass = (rate) => {
    const { grade } = parseAIGrade(rate);
    if (!grade) return '';
    
    const gradeClassMap = {
      'S': 'grade-s',
      'A': 'grade-a',
      'B': 'grade-b', 
      'C': 'grade-c',
      'D': 'grade-d',
      'X': 'grade-x'
    };
    
    return gradeClassMap[grade] || '';
  };

  const { displayName: aiGrade } = parseAIGrade(aiInspectionRate);
  


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
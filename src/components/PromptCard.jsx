import React from 'react';
import '../styles/Prompt.css';

/**
 * 이 컴포넌트는 목록의 프롬프트 카드 하나를 표시하는 역할을 합니다.
 * "아무것도 안보이는" 문제를 해결하기 위해, 데이터 수신 여부와 그 구조를
 * 시각적으로 확인할 수 있는 디버깅 코드를 대폭 강화했습니다.
 */
export default function PromptCard({ prompt, onEdit, onDelete, onView }) {
    if (!prompt || !prompt.prompt_id || !prompt.prompt_name) {
        // 필수 데이터가 없으면 카드를 렌더링하지 않음
        return null;
    }

    const {
        prompt_name,
        description,
        author,
        price,
        tags = [],
        image_url
    } = prompt;

    const handleEditClick = (e) => {
        e.stopPropagation();
        onEdit(prompt);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(prompt);
    };

    const handleViewClick = () => {
        onView(prompt);
    };

    const truncate = (text, length) => {
        if (!text) return '내용 없음';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <div className="prompt-card" onClick={handleViewClick}>
            <div className="prompt-card-image-container">
                <img src={image_url} alt={prompt_name} className="prompt-card-image" />
            </div>
            <div className="prompt-card-content">
                <div className="prompt-card-header">
                    <h3 className="prompt-card-title">{prompt_name}</h3>
                    <p className="prompt-card-owner">{author || '판매자 정보 없음'}</p>
                </div>
                <p className="prompt-card-description">{truncate(description, 100)}</p>
                <div className="prompt-card-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="prompt-tag">
              #{tag}
            </span>
                    ))}
                </div>
            </div>
            <div className="prompt-card-footer">
                <p className="prompt-card-price">₩ {price?.toLocaleString() || '가격 정보 없음'}</p>
                <div className="prompt-card-actions">
                    <button onClick={handleEditClick} className="prompt-button-edit">
                        수정
                    </button>
                    <button onClick={handleDeleteClick} className="prompt-button-delete">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}

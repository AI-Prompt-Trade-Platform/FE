import React from 'react';
import '../styles/Prompt.css'; // 이 파일이 올바르게 스타일링되어 있다고 가정합니다.

/**
 * 이 컴포넌트는 목록의 프롬프트 카드 하나를 표시하는 역할을 합니다.
 * "아무것도 안보이는" 문제를 해결하기 위해, 데이터 수신 여부와 그 구조를
 * 시각적으로 확인할 수 있는 디버깅 코드를 대폭 강화했습니다.
 */
export default function PromptCard({ prompt, onEdit, onDelete, onView }) {
    // 디버깅을 위해 카드에 항상 테두리를 표시합니다.
    const debugStyle = {
        border: '2px solid red',
        padding: '10px',
        margin: '10px',
        color: 'white',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px'
    };

    // 1. prompt prop이 없는 경우 (undefined, null 등)
    if (!prompt) {
        return (
            <div style={debugStyle}>
                <h4>[디버깅] PromptCard 오류</h4>
                <p>`prompt` prop 자체가 전달되지 않았습니다.</p>
                <p>상위 컴포넌트(PromptList)가 데이터를 올바르게 전달하는지 확인해주세요.</p>
            </div>
        );
    }

    // 2. prompt prop이 있지만 객체가 아닌 경우
    if (typeof prompt !== 'object' || Array.isArray(prompt)) {
        return (
            <div style={debugStyle}>
                <h4>[디버깅] 데이터 타입 오류</h4>
                <p>`prompt` prop이 객체(object)가 아닙니다. 현재 타입: {typeof prompt}</p>
                <pre>{JSON.stringify(prompt, null, 2)}</pre>
            </div>
        );
    }

    // camelCase/snake_case 모두 지원
    const promptId = prompt.promptId || prompt.prompt_id;
    const promptName = prompt.promptName || prompt.prompt_name;
    const promptContent = prompt.promptContent || prompt.prompt_content;
    const ownerProfileName = prompt.ownerProfileName || prompt.owner_profile_name;
    const tags = prompt.tags || prompt.hashTags || [];
    const price = prompt.price;
    const description = prompt.description;

    // 3. 객체는 맞지만, 필수 필드가 없는 경우
    if (!promptId || !promptName) {
        return (
            <div style={debugStyle}>
                <h4>[디버깅] 데이터 구조 오류</h4>
                <p>필수 항목(prompt_id, promptId, prompt_name, promptName)이 없습니다.</p>
                <p>수신된 데이터 전체:</p>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(prompt, null, 2)}
        </pre>
            </div>
        );
    }

    // --- 모든 데이터가 정상일 경우, 아래의 UI를 렌더링합니다. ---

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
            <div className="prompt-card-header">
                <h3 className="prompt-card-title">{promptName}</h3>
                <p className="prompt-card-owner">{ownerProfileName || '판매자 정보 없음'}</p>
            </div>

            <p className="prompt-card-content">{truncate(description || promptContent, 100)}</p>

            <div className="prompt-card-footer">
                <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(tags) && tags.map((tag, index) => (
                        <span key={index} className="prompt-tag">
              #{tag}
            </span>
                    ))}
                </div>
                <p className="prompt-card-price">₩ {price?.toLocaleString() || '가격 정보 없음'}</p>
            </div>

            <div className="prompt-card-actions">
                <button onClick={handleEditClick} className="prompt-button-edit">
                    수정
                </button>
                <button onClick={handleDeleteClick} className="prompt-button-delete">
                    삭제
                </button>
            </div>
        </div>
    );
}

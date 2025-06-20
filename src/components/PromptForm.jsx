import React from 'react';
import '../styles/Prompt.css'; // 가정: 스타일 파일 경로

/**
 * PromptCard 컴포넌트
 * 프롬프트의 요약 정보를 표시하고, 관련 액션(수정, 삭제, 상세보기)을 트리거합니다.
 */
export default function PromptCard({ prompt, onEdit, onDelete, onView }) {
    // prompt 객체가 유효하지 않으면 아무것도 렌더링하지 않습니다.
    if (!prompt) {
        return null;
    }

    // --- 이벤트 핸들러 ---
    // id만 전달하여 상위 컴포넌트가 작업을 수행하도록 합니다.
    const handleEdit = () => onEdit(prompt.id);
    const handleDelete = () => onDelete(prompt.id);
    const handleView = () => onView(prompt.id);

    // 내용이 길 경우를 대비해 잘라주는 함수 (예시)
    const truncate = (text, length) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <div className="prompt-card">
            {/* 제목: prompt.title이 없을 경우 '제목 없음' 표시 */}
            <h3 className="prompt-card-title">{prompt.title || '제목 없음'}</h3>

            {/* 내용: 100자로 제한하고 "..."을 붙여줍니다. */}
            <p className="prompt-card-content">
                {truncate(prompt.content || '내용 없음', 100)}
            </p>

            {/* 카테고리 정보: 옵셔널 체이닝으로 안전하게 접근 */}
            <div className="prompt-card-meta">
                <span>모델: {prompt.categories?.model || '정보 없음'}</span>
                <span>타입: {prompt.categories?.type || '정보 없음'}</span>
            </div>

            {/* 태그 목록: tag와 index를 조합하여 고유한 key 생성 */}
            <div className="flex flex-wrap gap-2 mt-2">
                {prompt.tags?.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="prompt-tag">#{tag}</span>
                ))}
            </div>

            {/* 액션 버튼 */}
            <div className="prompt-card-actions">
                <button onClick={handleEdit} className="prompt-button-edit">
                    수정
                </button>
                <button onClick={handleDelete} className="prompt-button-delete">
                    삭제
                </button>
                <button onClick={handleView} className="prompt-button-view">
                    상세
                </button>
            </div>
        </div>
    );
}
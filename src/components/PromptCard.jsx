import React from 'react';
import '../styles/Prompt.css';

export default function PromptCard({ prompt, onEdit, onDelete }) {
    return (
        <div className="prompt-card">
            <h3>{prompt.promptName || '제목 없음'}</h3>
            <p>{prompt.promptContent || '내용 없음'}</p>
            <p className="meta">모델: {prompt.model}</p>
            <p className="meta">타입: {prompt.type}</p>

            <div className="flex flex-wrap gap-2 mt-2">
                {prompt.tags?.map((tag, index) => (
                    <span key={index} className="prompt-tag">#{tag}</span>
                ))}
            </div>

            <div className="prompt-card-actions">
                <button
                    onClick={() => onEdit(prompt)}
                    className="prompt-button-edit"
                >
                    수정
                </button>
                <button
                    onClick={() => onDelete(prompt)}
                    className="prompt-button-delete"
                >
                    삭제
                </button>
            </div>
        </div>
    );
}

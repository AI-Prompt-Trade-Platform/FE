import React from 'react';
import '../styles/Prompt.css';

export default function PromptList({ prompts, onEdit, onDelete, onView }) {
    return (
        <div className="prompt-list-wrapper">
            <div className="prompt-list-container">
                {prompts.map((prompt, index) => (
                    <div key={index} className="prompt-card">
                        <h3>{prompt.promptName || '제목 없음'}</h3>
                        <p>{prompt.content || '내용 없음'}</p> {/* ✅ 수정 */}
                        <h3>{prompt.title || '제목 없음'}</h3>
                        <p>{prompt.content || '내용 없음'}</p>


                        <div className="flex flex-wrap gap-2 mt-2">
                            {prompt.tags?.map((tag, i) => (
                                <span key={i} className="prompt-tag">#{tag}</span>
                            ))}
                        </div>

                        <div className="prompt-card-actions">
                            <button onClick={() => onEdit(prompt)} className="prompt-button-edit">수정</button>
                            <button onClick={() => onDelete(prompt.id)} className="prompt-button-delete">삭제</button>
                            <button onClick={() => onView(prompt)} className="prompt-button-view">상세</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

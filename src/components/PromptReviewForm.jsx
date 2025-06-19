import React, { useState } from 'react';
import '../styles/Prompt.css';

export default function PromptReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        onSubmit?.({ rating, comment, username: '익명', date: new Date().toLocaleDateString() });
        setRating(5);
        setComment('');
    };

    return (
        <form className="prompt-box" onSubmit={handleSubmit}>
            <label className="prompt-label">평점</label>
            <select className="prompt-input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>

            <label className="prompt-label" style={{ marginTop: '12px' }}>리뷰</label>
            <textarea
                className="prompt-input"
                rows="3"
                placeholder="리뷰를 입력하세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
            />

            <button className="prompt-button" type="submit" style={{ marginTop: '12px' }}>
                등록하기
            </button>
        </form>
    );
}

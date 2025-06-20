import React, { useState } from 'react';

export default function PromptReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            alert('별점과 리뷰 내용을 모두 입력해주세요.');
            return;
        }
        onSubmit({ rating, comment });
        setRating(0);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col items-start">
                <span className="mb-1 font-semibold text-lg text-[#ffe066]">별점:</span>
                <div className="flex items-center gap-2 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`text-3xl transition-all duration-150 cursor-pointer select-none ${
                                (hover || rating) >= star
                                    ? 'text-yellow-400 drop-shadow-[0_0_8px_#ffe066] scale-110'
                                    : 'text-gray-600'
                            }`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                    <span className="ml-2 text-base text-[#ffe066] font-bold">
                        {rating > 0 ? rating + '점' : ''}
                    </span>
                </div>
            </div>
            <textarea
                className="w-full p-2 bg-gray-700 rounded-md text-white placeholder-gray-400"
                rows="3"
                placeholder="리뷰를 작성해주세요."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button type="submit" className="prompt-button-main w-full mt-2">
                리뷰 제출
            </button>
        </form>
    );
}
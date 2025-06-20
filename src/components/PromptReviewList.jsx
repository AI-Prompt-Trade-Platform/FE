import React, { useState } from 'react';

// 별점 표시 컴포넌트 (예시)
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>);
    }
    return <div>{stars}</div>;
};

export default function PromptReviewList({ reviews }) {
    const [showAll, setShowAll] = useState(false);
    if (!reviews || reviews.length === 0) {
        return <p className="text-sm text-gray-400">아직 작성된 리뷰가 없습니다.</p>;
    }
    const visibleReviews = showAll ? reviews : reviews.slice(0, 5);
    return (
        <div className="space-y-4">
            {visibleReviews.map((review, idx) => (
                <div
                    key={review.id ?? idx}
                    className={idx !== visibleReviews.length - 1 ? "border-b border-gray-700 pb-2" : ""}
                >
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{review.authorName}</p>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-gray-300 mt-1">{review.comment}</p>
                </div>
            ))}
            {reviews.length > 5 && !showAll && (
                <button
                    className="text-yellow-400 underline text-sm mt-2"
                    onClick={() => setShowAll(true)}
                >
                    리뷰 더보기
                </button>
            )}
            {reviews.length > 5 && showAll && (
                <button
                    className="text-yellow-400 underline text-sm mt-2"
                    onClick={() => setShowAll(false)}
                >
                    리뷰 접기
                </button>
            )}
        </div>
    );
}
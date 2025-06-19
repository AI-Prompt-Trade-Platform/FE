// src/components/PromptReviewList.jsx
import React from 'react';
import PromptReviewItem from './PromptReviewItem';

export default function PromptReviewList({ reviews = [] }) {
    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">구매자 리뷰</h3>
            {reviews.length === 0 ? (
                <p className="text-sm text-gray-400">아직 등록된 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review, index) => (
                    <PromptReviewItem key={index} review={review} />
                ))
            )}
        </div>
    );
}

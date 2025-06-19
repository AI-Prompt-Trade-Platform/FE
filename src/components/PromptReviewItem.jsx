// src/components/PromptReviewItem.jsx
import React from 'react';

export default function PromptReviewItem({ review }) {
    return (
        <div className="bg-[#2c2c2c] p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
                {"⭐".repeat(review.rating)}
            </div>
            <p className="mt-2 text-white text-sm">{review.comment}</p>
            <div className="text-xs text-gray-400 mt-1">
                {review.username} • {review.date}
            </div>
        </div>
    );
}

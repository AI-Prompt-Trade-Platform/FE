// src/components/PromptSellerInfo.jsx
import React from 'react';

export default function PromptSellerInfo({ seller }) {
    return (
        <div className="bg-[#2c2c2c] p-4 rounded-lg text-white">
            <h4 className="text-sm text-gray-400">판매자 정보</h4>
            <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                <div className="text-sm">{seller?.name || '판매자 이름'}</div>
            </div>
        </div>
    );
}

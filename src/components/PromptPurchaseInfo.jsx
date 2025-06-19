// src/components/PromptPurchaseInfo.jsx
import React from 'react';

export default function PromptPurchaseInfo({ price = 25000, onBuy }) {
    return (
        <div className="bg-[#2c2c2c] p-4 rounded-lg text-white space-y-4">
            <div>
                <div className="text-sm text-gray-400">가격</div>
                <div className="text-2xl font-bold">₩ {price.toLocaleString()}</div>
            </div>
            <button
                className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300"
                onClick={onBuy}
            >
                구매하기
            </button>
        </div>
    );
}

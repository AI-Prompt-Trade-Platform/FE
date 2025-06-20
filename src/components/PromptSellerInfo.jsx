import React from 'react';

export default function PromptSellerInfo({ ownerProfileName }) {
    return (
        <div>
            <h4 className="font-semibold mb-2">판매자 정보</h4>
            <p className="text-sm">프로필명: {ownerProfileName || "정보 없음"}</p>
            {/* 여기에 판매자 관련 추가 정보 (예: 프로필 사진, 판매 등급 등)를 표시할 수 있습니다. */}
        </div>
    );
}
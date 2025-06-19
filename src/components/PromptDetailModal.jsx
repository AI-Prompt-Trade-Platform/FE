import ReactDOM from 'react-dom';
import React from 'react';
import '../styles/Prompt.css';
import PromptPurchaseInfo from './PromptPurchaseInfo';
import PromptSellerInfo from './PromptSellerInfo';
import PromptReviewList from './PromptReviewList';
import PromptReviewForm from './PromptReviewForm';


export default function PromptDetailModal({ prompt, onClose }) {
    if (!prompt) return null;

    const modalRoot = document.getElementById('modal-root');


    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="prompt-modal">
                <div className="flex justify-between items-center">
                    <h2 className="prompt-title">{prompt.promptName}</h2>
                    <button className="prompt-close-button" onClick={onClose}>닫기</button>
                </div>

                <div className="prompt-box min-h-[150px]">
                    {prompt.promptContent}
                </div>

                <div className="prompt-rating">
                    <span>⭐ {prompt.rating || "4.8"}/5.0</span>
                    <span>|</span>
                    <span>AI 등급: {prompt.grade || "프리미엄"}</span>
                </div>

                <div>
                    <h3 className="prompt-section-title">프롬프트 설명</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {prompt.description || "이 프롬프트는 AI를 사용하여 독창적인 콘텐츠를 생성하는 데 도움이 됩니다."}
                    </p>
                </div>

                <div className="prompt-detail-layout">
                    {/* 오른쪽 */}
                    <div className="prompt-detail-sidebar">
                        <div className="prompt-box">
                            <PromptSellerInfo seller={prompt.seller}/>
                        </div>
                        <div className="prompt-box">
                            <div className="prompt-price">가격: ₩ {prompt.price?.toLocaleString() || "25,000"}</div>
                            <button className="prompt-button-main">구매하기</button>
                            <button className="prompt-button-secondary">위시리스트에 추가</button>
                        </div>
                    </div>

                    {/* 왼쪽 */}
                    <div className="prompt-detail-main">
                        <div>
                            <h3 className="prompt-section-title">구매자 리뷰</h3>
                            <PromptReviewList reviews={prompt.reviews || []}/>
                        </div>
                        <div>
                            <h3 className="prompt-section-title">리뷰 작성</h3>
                            <PromptReviewForm promptId={prompt.promptId}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

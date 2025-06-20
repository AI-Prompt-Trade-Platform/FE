import React from 'react';
import ReactDOM from 'react-dom';
import PromptSellerInfo from './PromptSellerInfo';
import PromptReviewList from './PromptReviewList';
import PromptReviewForm from './PromptReviewForm';
import '../styles/Prompt.css';

export default function PromptDetailModal({ prompt, onClose, onReviewSubmit, onPurchase }) {
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error("'modal-root' 엘리먼트를 찾을 수 없습니다. public/index.html 파일을 확인해주세요.");
        return null;
    }
    if (!prompt) {
        return <div className="text-gray-400 text-center p-8">프롬프트 정보가 없습니다.</div>;
    }
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="prompt-modal">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="prompt-title">{prompt.prompt_name || prompt.title}</h2>
                    <button className="prompt-close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="prompt-detail-layout flex flex-row gap-8">
                    {/* 왼쪽 섹션 */}
                    <div className="prompt-detail-main flex flex-col flex-1 min-w-0" style={{ minWidth: 0, maxWidth: '70%' }}>
                        <div className="prompt-box min-h-[150px] mb-4">
                            {prompt.prompt_content || prompt.content}
                        </div>
                        <div className="mb-6">
                            <h3 className="prompt-section-title">프롬프트 설명</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {prompt.description || "이 프롬프트는 AI를 사용하여 독창적인 콘텐츠를 생성하는 데 도움이 됩니다."}
                            </p>
                        </div>
                        <div className="mb-6 flex-1 overflow-y-auto" style={{ maxHeight: 240 }}>
                            <h3 className="prompt-section-title">구매자 리뷰</h3>
                            <PromptReviewList reviews={prompt.reviews || []} />
                        </div>
                    </div>
                    {/* 오른쪽 사이드바 */}
                    <div className="prompt-detail-sidebar w-80 min-w-[280px]" style={{ position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
                        <div className="prompt-box mb-4">
                            <PromptSellerInfo ownerProfileName={prompt.owner_profile_name || prompt.ownerProfileName} />
                        </div>
                        <div className="prompt-box">
                            <div className="prompt-rating mb-4">
                                <span>⭐ {prompt.averageRating?.toFixed(1) || "0.0"} / 5.0</span>
                                <span className="mx-2">|</span>
                                <span>AI 등급: {prompt.aiInspectionRate || prompt.ai_inspection_rate || "정보 없음"}</span>
                            </div>
                            <div className="prompt-price mb-4">가격: ₩ {prompt.price?.toLocaleString() || "0"}</div>
                            {prompt.userPurchased ? (
                                <div>
                                    <h3 className="prompt-section-title">리뷰 작성</h3>
                                    <PromptReviewForm onSubmit={onReviewSubmit} />
                                </div>
                            ) : (
                                <>
                                    <button className="prompt-button-main w-full" onClick={() => onPurchase(prompt)}>구매하기</button>
                                    <button className="prompt-button-secondary w-full mt-2">위시리스트에 추가</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

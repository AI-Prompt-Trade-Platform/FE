import React, { useState, useEffect } from 'react';
import PromptSection from '../components/PromptSection/PromptSection';
import StarryBackground from '../components/Background/StarryBackground';
import PromptDetailModal from '../components/PromptDetailModal/PromptDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import './WishlistPage.css';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAccessTokenSilently, isLoggedIn, isLoading } = useAuth();
    const { loadingMessage, refreshMessage } = useLoadingMessage(true);
    const shouldShowLoading = useMinimumLoadingTime(loading, 800);

    // 모달 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromptId, setSelectedPromptId] = useState(null);
    
    // 모달 핸들러 추가
    const handleCardClick = (promptId) => {
        setSelectedPromptId(promptId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPromptId(null);
    };

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            refreshMessage();

            if (!isLoggedIn) {
                setError('로그인이 필요합니다.');
                setLoading(false);
                return;
            }

            const authToken = await getAccessTokenSilently();
            
            // API 클라이언트를 사용하는 대신 직접 fetch 호출
            const response = await fetch('/api/wishlist', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) {
                throw new Error(`위시리스트 API 오류: ${response.status}`);
            }

            const wishlistData = await response.json();

            const formattedPrompts = wishlistData.content.map(item => ({
                id: item.promptId,
                title: item.promptName || '제목 없음',
                description: item.description || '설명이 없습니다',
                price: item.price || 0,
                author: item.ownerProfileName || '알 수 없는 판매자',
                rating: item.rate || parseFloat(item.aiInspectionRate) || 0,
                thumbnail: item.thumbnailImageUrl || '',
                tags: item.hashTags || [],
            }));

            setWishlist(formattedPrompts);
            setError(null);
        } catch (err) {
            console.error('위시리스트 로딩 오류:', err);
            setError(err.message || '위시리스트 불러오기 실패');
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            fetchWishlist();
        }
    }, [isLoggedIn, isLoading, getAccessTokenSilently]);
    
    const handlePurchase = () => {
        // 모달에서 구매가 완료되면 위시리스트를 다시 불러옵니다.
        fetchWishlist();
    };


    return (
        <div className="wishlist-page">
            <StarryBackground />
            <main className="wishlist-main">
                <h1 className="wishlist-title">나의 위시리스트</h1>
                <div className="content-area">
                    {shouldShowLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p className="loading-message">{loadingMessage}</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">불러오기 실패: {error}</div>
                    ) : wishlist.length === 0 ? (
                        <div className="empty-wishlist">
                            <div className="empty-wishlist-content">
                                <div className="empty-wishlist-icon">✨</div>
                                <p className="main-text">위시리스트가 비어 있습니다.</p>
                                <p className="sub-text">마음에 드는 프롬프트를 찾아<br/>위시리스트에 추가해보세요!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="wishlist-content">
                            <PromptSection
                                prompts={wishlist}
                                showMore={false}
                                onCardClick={handleCardClick}
                            />
                        </div>
                    )}
                </div>
            </main>

            {isModalOpen && (
                <PromptDetailModal
                    promptId={selectedPromptId}
                    onClose={handleCloseModal}
                    onPurchase={handlePurchase}
                />
            )}
        </div>
    );
};

export default WishlistPage;
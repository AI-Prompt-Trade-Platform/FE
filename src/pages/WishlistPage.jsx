import React, { useState, useEffect } from 'react';
import PromptSection from '../components/PromptSection/PromptSection';
import StarryBackground from '../components/Background/StarryBackground';
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

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                refreshMessage(); // 새로운 로딩 메시지 생성
                
                // 디버깅용 로그
                console.log('Auth 상태:', { isLoggedIn, isLoading });

                // 인증되지 않은 경우 처리
                if (!isLoggedIn) {
                    console.log('로그인되지 않음, 에러 처리');
                    setError('로그인이 필요합니다.');
                    setLoading(false);
                    return;
                }

                // 유효한 토큰 가져오기
                const authToken = await getAccessTokenSilently();

                // 위시리스트 API 호출
                const wishlistUrl = '/api/wishlist';
                console.log(`위시리스트 API 요청 시작: ${wishlistUrl}`);

                const wishlistResponse = await fetch(wishlistUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!wishlistResponse.ok) {
                    const errorText = await wishlistResponse.text();
                    console.error('위시리스트 API 응답 내용:', errorText);
                    throw new Error(`위시리스트 API 오류: ${wishlistResponse.status}`);
                }

                const wishlistData = await wishlistResponse.json();
                console.log('위시리스트 원본 데이터:', JSON.stringify(wishlistData, null, 2));

                // 백엔드에서 이미 필요한 모든 정보를 제공하므로 추가 API 호출 없이 데이터 변환
                const formattedPrompts = wishlistData.content.map(item => ({
                    id: item.promptId,
                    title: item.promptName || '제목 없음',
                    description: item.description || '설명이 없습니다',
                    price: item.price || 0,
                    author: item.ownerProfileName || '알 수 없는 판매자',
                    owner: item.ownerProfileName || '알 수 없는 판매자',
                    rating: item.rate || parseFloat(item.aiInspectionRate) || 0,
                    thumbnailUrl: item.thumbnailImageUrl || '',
                    thumbnail: item.thumbnailImageUrl || '',
                    tags: item.hashTags || [],
                    aiInspectionRate: item.aiInspectionRate || '',
                    createdAt: item.createdAt,
                    category: item.typeCategory || '기타',
                    downloads: item.salesCount || 0
                }));

                console.log('포맷된 위시리스트 데이터:', JSON.stringify(formattedPrompts, null, 2));
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

        // Auth가 로딩 중이 아닐 때만 실행
        if (!isLoading) {
            fetchWishlist();
        }
    }, [isLoggedIn, isLoading, getAccessTokenSilently]);

    return (
        <div className="wishlist-page">
            <StarryBackground />
            <main className="wishlist-main">
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
                            <p>위시리스트가 비어 있습니다.</p>
                        </div>
                    ) : (
                        <div className="wishlist-content">
                            <PromptSection
                                prompts={wishlist}
                                showMore={false}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WishlistPage;
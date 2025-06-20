import React, { useState, useEffect } from 'react';
import PromptSection from '../components/PromptSection/PromptSection';
import StarryBackground from '../components/Background/StarryBackground';
import './WishlistPage.css';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auth0 토큰 (테스트용으로 유지)
    const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVsSVVkQWFOV3VJbmdqaFVqbVlrUiJ9.eyJpc3MiOiJodHRwczovL2Rldi1vbXVkdTQ2NWVtazN0MmpqLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJFN0w4VDRYVVZIRWRuSUhMS2hacGFlcGdMMlk5Z1h3Y0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkucHJ1bXB0LmxvY2FsIiwiaWF0IjoxNzUwNDA3MjAzLCJleHAiOjE3NTA0OTM2MDMsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IkU3TDhUNFhVVkhFZG5JSExLaFpwYWVwZ0wyWTlnWHdjIn0.SkE15UHNc9KmtPE264ZI2qKYZv_4D0EokUmDEoqTtVCCwaEjoDBRT8w904ed4sht5Wi1kC-HbIo1kzxAqPfvLDqN3jZYYr-tC8P0j8rAPAmyY_jkvbOJL_t-zd7lRdF-rwsxo34ttBjHicdnj9qvk-Mzg8EBz4Jr1WM9lbXeAPjX1FFUDo9EXSAinDETYxTIlBka45VLmutRyjzvM4IDpSgqrEZaCmLt2g0zFCYFE4fiIdUPufnUXtekQEvX4Dkdz6CQHC13TDU7eQ8SLdqQeaEkGzg0PHXfKMV9V7TS4mCkO5jwSn3y7Iruym8iZUWefpPti7fRfJp6CWI0nLoMpQ";

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);

                // 위시리스트 API 호출
                const wishlistUrl = 'http://localhost:8080/api/wishlist';
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

        fetchWishlist();
    }, []);

    return (
        <div className="wishlist-page">
            <StarryBackground />
            <main className="wishlist-main">
                <div className="content-area">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p className="loading-message">위시리스트를 불러오는 중...</p>
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
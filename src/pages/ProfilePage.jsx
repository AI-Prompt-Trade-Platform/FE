import React, { useState, useEffect } from 'react';
import StarryBackground from '../components/Background/StarryBackground';
import UserProfileBanner from '../components/UserProfile/UserProfileBanner';
import ProfileTabs from '../components/UserProfile/ProfileTabs';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import { useAuth } from '../contexts/AuthContext';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import './ProfilePage.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('purchased');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [updating, setUpdating] = useState(false);
    const { loadingMessage, refreshMessage } = useLoadingMessage(true);
    const shouldShowLoading = useMinimumLoadingTime(loading, 800);
    const shouldShowUpdating = useMinimumLoadingTime(updating, 500);

    // 탭 데이터 상태 추가
    const [purchasedPrompts, setPurchasedPrompts] = useState([]);
    const [sellingPrompts, setSellingPrompts] = useState([]);
    const [salesSummary, setSalesSummary] = useState(null);
    const [tabLoading, setTabLoading] = useState(false);
    const [tabError, setTabError] = useState(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Auth Context 사용
    const { getAccessTokenSilently, isLoggedIn, isLoading, user } = useAuth();

    // 사용자 프로필 정보 가져오기
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            refreshMessage(); // 새로운 로딩 메시지 생성

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                setError('로그인이 필요합니다.');
                setLoading(false);
                return;
            }

            // 유효한 토큰 가져오기
            const authToken = await getAccessTokenSilently();

            const response = await fetch('http://localhost:8080/api/mypage/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`프로필 조회 실패: ${response.status}`);
            }
            const data = await response.json();
            console.log('사용자 프로필 데이터:', data);
            setUserProfile(data);
        } catch (err) {
            console.error('프로필 로딩 오류:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 판매 중인 프롬프트 목록 가져오기
    const fetchSellingPrompts = async (page = 0, size = 10) => {
        try {
            setTabLoading(true);
            setTabError(null);

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                setTabError('로그인이 필요합니다.');
                setTabLoading(false);
                return;
            }

            // 유효한 토큰 가져오기
            const authToken = await getAccessTokenSilently();

            const url = `http://localhost:8080/api/mypage/prompts/selling?page=${page}&size=${size}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`판매 중인 프롬프트 조회 실패: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('판매 중인 프롬프트 데이터:', data);
            
            // 백엔드에서 제공하는 데이터를 직접 활용
            const formattedPrompts = data.content.map(prompt => ({
                id: prompt.promptId,
                title: prompt.promptName || '제목 없음',
                description: prompt.description || '설명 없음',
                category: prompt.typeCategory || '기타',
                rating: prompt.rate || parseFloat(prompt.aiInspectionRate) || 0,
                price: prompt.price || 0,
                author: userProfile?.profileName || '내 프롬프트',
                thumbnail: prompt.thumbnailImageUrl || '/default-thumbnail.png',
                tags: prompt.hashTags || [],
                downloads: prompt.salesCount || 0,
                totalRevenue: prompt.totalRevenue || 0,
                createdAt: prompt.createdAt,
                aiInspectionRate: prompt.aiInspectionRate
            }));
            
            setSellingPrompts(formattedPrompts);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.pageNumber || 0);
        } catch (err) {
            console.error('판매 중인 프롬프트 로딩 오류:', err);
            setTabError(err.message);
        } finally {
            setTabLoading(false);
        }
    };
    // 구매한 프롬프트 목록 가져오기
    const fetchPurchasedPrompts = async (page = 0, size = 10) => {
        try {
            setTabLoading(true);
            setTabError(null);

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                setTabError('로그인이 필요합니다.');
                setTabLoading(false);
                return;
            }

            // 유효한 토큰 가져오기
            const authToken = await getAccessTokenSilently();

            const url = `http://localhost:8080/api/mypage/prompts/purchased?page=${page}&size=${size}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`구매한 프롬프트 조회 실패: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('구매한 프롬프트 데이터:', data);
            
            // 백엔드에서 제공하는 데이터를 직접 활용
            const formattedPrompts = data.content.map(prompt => ({
                id: prompt.promptId,
                title: prompt.promptName || '제목 없음',
                description: prompt.description || '설명 없음',
                category: prompt.typeCategory || '기타',
                rating: prompt.rate || parseFloat(prompt.aiInspectionRate) || 0,
                price: prompt.price || 0,
                author: prompt.ownerProfileName || '판매자 정보 없음',
                thumbnail: prompt.thumbnailImageUrl || '/default-thumbnail.png',
                tags: prompt.hashTags || [],
                downloads: prompt.salesCount || 0,
                purchasedAt: prompt.purchasedAt
            }));
            
            setPurchasedPrompts(formattedPrompts);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.pageNumber || 0);
        } catch (err) {
            console.error('구매한 프롬프트 로딩 오류:', err);
            setTabError(err.message);
        } finally {
            setTabLoading(false);
        }
    };
    // 거래 요약 정보 가져오기
    const fetchSalesSummary = async (period = 'MONTH') => {
        try {
            setTabLoading(true);
            setTabError(null);

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                setTabError('로그인이 필요합니다.');
                setTabLoading(false);
                return;
            }

            // 유효한 토큰 가져오기
            const authToken = await getAccessTokenSilently();

            const url = `http://localhost:8080/api/mypage/monitoring?period=${period}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`거래 요약 조회 실패: ${response.status}`);
            }
            const data = await response.json();
            console.log('거래 요약 데이터:', data);
            setSalesSummary(data);
        } catch (err) {
            console.error('거래 요약 로딩 오류:', err);
            setTabError(err.message);
        } finally {
            setTabLoading(false);
        }
    };

    // 페이지 변경 처리
    const handlePageChange = (newPage) => {
        if (activeTab === 'purchased') {
            fetchPurchasedPrompts(newPage, pageSize);
        } else if (activeTab === 'selling') {
            fetchSellingPrompts(newPage, pageSize);
        }
    };

    useEffect(() => {
        // Auth가 로딩 중이 아닐 때만 실행
        if (!isLoading) {
            fetchUserProfile();
        }
    }, [isLoggedIn, isLoading]);

    // 탭 변경 시 해당 데이터 로드
    useEffect(() => {
        // Auth가 로딩 중이 아니고 로그인된 상태일 때만 실행
        if (!isLoading && isLoggedIn) {
            if (activeTab === 'purchased') {
                fetchPurchasedPrompts(0, pageSize); // 탭 변경 시 첫 페이지부터 로드
            } else if (activeTab === 'selling') {
                fetchSellingPrompts(0, pageSize); // 탭 변경 시 첫 페이지부터 로드
            } else if (activeTab === 'summary') {
                fetchSalesSummary();
            }
        }
    }, [activeTab, isLoggedIn, isLoading]);

    // 이미지 파일을 서버에 업로드하는 함수
    const uploadImage = async (file, type) => {
        if (!file) return null;

        // 인증되지 않은 경우 처리
        if (!isLoggedIn) {
            throw new Error('로그인이 필요합니다.');
        }

        // 유효한 토큰 가져오기
        const authToken = await getAccessTokenSilently();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type); // 'profile' 또는 'banner'

        try {
            // 이미지 업로드 API 엔드포인트 (실제 구현 필요)
            const uploadUrl = 'http://localhost:8080/api/upload';
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`이미지 업로드 실패: ${response.status}`);
            }

            const data = await response.json();
            return data.imageUrl; // 업로드된 이미지 URL 반환
        } catch (error) {
            console.error(`${type} 이미지 업로드 오류:`, error);
            throw error;
        }
    };

    // 프로필 업데이트 처리 함수
    const handleProfileUpdate = async (updateData) => {
        try {
            setUpdating(true);

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                alert('로그인이 필요합니다.');
                setUpdating(false);
                return;
            }

            // 유효한 토큰 가져오기
            const authToken = await getAccessTokenSilently();

            let profileImgUrl = userProfile.profileImgUrl;
            let bannerImgUrl = userProfile.bannerImgUrl;

            if (updateData.avatarFile) {
                profileImgUrl = URL.createObjectURL(updateData.avatarFile);
            }
            if (updateData.bannerFile) {
                bannerImgUrl = URL.createObjectURL(updateData.bannerFile);
            }

            const updateUrl = 'http://localhost:8080/api/mypage/me/profile/update';
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profileName: updateData.profileName,
                    introduction: updateData.introduction,
                    profileImgUrl: profileImgUrl,
                    bannerImgUrl: bannerImgUrl
                })
            });
            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                console.error('프로필 업데이트 API 응답 내용:', errorText);
                throw new Error(`프로필 업데이트 API 오류: ${updateResponse.status}`);
            }

            const updatedProfile = await updateResponse.json();
            console.log('업데이트된 프로필 데이터:', JSON.stringify(updatedProfile, null, 2));

            // 업데이트된 프로필 정보로 상태 갱신
            setUserProfile(updatedProfile);

            // 성공 메시지 표시
            alert('프로필이 성공적으로 업데이트되었습니다.');
        } catch (err) {
            console.error('프로필 업데이트 오류:', err);
            alert(`프로필 업데이트 실패: ${err.message || '알 수 없는 오류'}`);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    // 판매 중인 프롬프트 탭 렌더링
    const renderSellingPromptsTab = () => {
        if (tabLoading) {
            return <div className="loading-spinner">로딩 중...</div>;
        }

        if (tabError) {
            return <div className="error-message">{tabError}</div>;
        }

        if (sellingPrompts.length === 0) {
            return <div className="empty-message">판매 중인 프롬프트가 없습니다.</div>;
        }
        return (
            <>
                <PromptCarousel
                    title="판매 중인 프롬프트"
                    prompts={sellingPrompts}
                />
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="pagination-button"
                        >
                            이전
                        </button>
                        <span className="page-info">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="pagination-button"
                        >
                            다음
                        </button>
                    </div>
                )}
            </>
        );
    };

    // 구매한 프롬프트 탭 렌더링
    const renderPurchasedPromptsTab = () => {
        if (tabLoading) {
            return <div className="loading-spinner">로딩 중...</div>;
        }
        if (tabError) {
            return <div className="error-message">{tabError}</div>;
        }
        if (purchasedPrompts.length === 0) {
            return <div className="empty-message">구매한 프롬프트가 없습니다.</div>;
        }
        return (
            <>
                <PromptCarousel
                    title="구매한 프롬프트"
                    prompts={purchasedPrompts}
                />

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="pagination-button"
                        >
                            이전
                        </button>
                        <span className="page-info">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="pagination-button"
                        >
                            다음
                        </button>
                    </div>
                )}
            </>
        );
    };
    // 거래 요약 탭 렌더링
    const renderSalesSummaryTab = () => {
        if (tabError) {
            return <div className="error-message">불러오기 실패: {tabError}</div>;
        }
        if (!salesSummary) {
            return <div className="empty-list">거래 요약 정보가 없습니다.</div>;
        }
        // 판매 중인 프롬프트 데이터 변환
        const sellingPromptsList = salesSummary.allPrompts?.map(prompt => ({
            id: prompt.promptId,
            title: prompt.promptName,
            description: prompt.promptContent || '설명 없음',
            price: prompt.price || 0,
            thumbnail: '/default-thumbnail.png'
        })) || [];
        return (
            <div className="sales-summary-container">
                <div className="summary-header">
                    <h2>거래 요약</h2>
                    <div className="period-selector">
                        <button onClick={() => fetchSalesSummary('MONTH')}>1개월</button>
                        <button onClick={() => fetchSalesSummary('HALF_YEAR')}>6개월</button>
                        <button onClick={() => fetchSalesSummary('YEAR')}>1년</button>
                    </div>
                </div>
                <div className="summary-stats">
                    <div className="stat-card">
                        <h3>이달 총 수익</h3>
                        <p className="stat-value">{salesSummary.thisMonthProfit || 0} 포인트</p>
                    </div>
                    <div className="stat-card">
                        <h3>총 판매 건수</h3>
                        <p className="stat-value">{salesSummary.totalSalesCount || 0}건</p>
                    </div>
                    <div className="stat-card">
                        <h3>평균 별점</h3>
                        <p className="stat-value">{salesSummary.avgRate?.rateAvg || '평가 없음'}</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        if (tabLoading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-message">{loadingMessage}</p>
                </div>
            );
        }
        switch (activeTab) {
            case 'purchased':
                return renderPurchasedPromptsTab();
            case 'selling':
                return renderSellingPromptsTab();
            case 'summary':
                return renderSalesSummaryTab();
            default:
                return <div className="empty-list">선택된 탭이 없습니다.</div>;
        }
    };

    return (
        <div className="profile-page">
            <StarryBackground />
            <main className="profile-main">
                {shouldShowLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-message">{loadingMessage}</p>
                    </div>
                ) : shouldShowUpdating ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p className="loading-message">{loadingMessage}</p>
                    </div>
                ) : error ? (
                    <div className="error-message">프로필 정보 불러오기 실패: {error}</div>
                ) : (
                    <UserProfileBanner
                        userInfo={{
                            name: user?.name || user?.email || userProfile?.profileName || '사용자',
                            bio: userProfile?.introduction || '소개글이 없습니다.',
                        }}
                        profileImage={userProfile?.profileImgUrl}
                        avatarImage={userProfile?.profileImgUrl}
                        bannerImage={userProfile?.bannerImgUrl}
                        onProfileUpdate={handleProfileUpdate}
                    />
                )}
                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { id: 'purchased', label: '구매한 프롬프트' },
                        { id: 'selling', label: '판매 중인 프롬프트' },
                        { id: 'summary', label: '거래 요약' },
                    ]}
                />
                <div className="profile-content">
                    {renderTabContent()}
                </div>
            </main>
        </div>
    );
};
export default ProfilePage;
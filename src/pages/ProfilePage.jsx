import React, { useState, useEffect } from 'react';
import StarryBackground from '../components/Background/StarryBackground';
import UserProfileBanner from '../components/UserProfile/UserProfileBanner';
import ProfileTabs from '../components/UserProfile/ProfileTabs';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import PromptDetailModal from '../components/PromptDetailModal/PromptDetailModal';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import { userAPI, statsAPI, setAuthToken } from '../services/api';
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

    // 모달 상태 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromptId, setSelectedPromptId] = useState(null);

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
    const { showError, showSuccess } = useAlert();

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

            // 유효한 토큰 가져오기 및 설정
            const authToken = await getAccessTokenSilently();
            setAuthToken(authToken);

            const data = await userAPI.getProfile();
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

            // 유효한 토큰 가져오기 및 설정
            const authToken = await getAccessTokenSilently();
            setAuthToken(authToken);

            const data = await userAPI.getSellingHistory(page, size);
            console.log('판매 중인 프롬프트 데이터:', data);
            
            // 백엔드에서 제공하는 데이터를 프론트엔드 구조에 맞게 변환
            const formattedPrompts = data.content.map(prompt => {
                // AI 등급 데이터 확인 - 다양한 필드명 지원
                const aiGradeData = prompt.aiInspectionRate || 
                                   prompt.ai_inspection_rate || 
                                   prompt.aiGrade ||
                                   prompt.ai_grade ||
                                   prompt.grade ||
                                   prompt.aiRating ||
                                   prompt.ai_rating ||
                                   null;
                
                return {
                    id: prompt.id, // promptId -> id
                    title: prompt.title || '제목 없음', // promptName -> title
                    description: prompt.description || '설명 없음',
                    category: prompt.categories?.typeName || '기타',
                    rating: prompt.averageRating || 0,
                    price: prompt.price || 0,
                    author: { name: prompt.ownerProfileName || userProfile?.profileName || '내 프롬프트' },
                    thumbnail: prompt.thumbnailImageUrl || '/default-thumbnail.png',
                    tags: prompt.hashTags || [],
                    downloads: prompt.salesCount || 0,
                    aiInspectionRate: aiGradeData
                };
            });
            
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

            // 유효한 토큰 가져오기 및 설정
            const authToken = await getAccessTokenSilently();
            setAuthToken(authToken);

            const data = await userAPI.getPurchaseHistory(page, size);
            console.log('구매한 프롬프트 데이터:', data);
            
            // 백엔드에서 제공하는 데이터를 직접 활용
            const formattedPrompts = data.content.map(prompt => {
                // AI 등급 데이터 확인 - 다양한 필드명 지원
                const aiGradeData = prompt.aiInspectionRate || 
                                   prompt.ai_inspection_rate || 
                                   prompt.aiGrade ||
                                   prompt.ai_grade ||
                                   prompt.grade ||
                                   prompt.aiRating ||
                                   prompt.ai_rating ||
                                   null;
                
                return {
                    id: prompt.promptId,
                    title: prompt.promptName || '제목 없음',
                    description: prompt.description || '설명 없음',
                    category: prompt.typeCategory || '기타',
                    rating: prompt.rate || parseFloat(prompt.aiInspectionRate) || 0,
                    price: prompt.price || 0,
                    author: { name: prompt.ownerProfileName || '판매자 정보 없음' },
                    thumbnail: prompt.thumbnailImageUrl || '/default-thumbnail.png',
                    tags: prompt.hashTags || [],
                    downloads: prompt.salesCount || 0,
                    purchasedAt: prompt.purchasedAt,
                    aiInspectionRate: aiGradeData
                };
            });
            
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

            // 유효한 토큰 가져오기 및 설정
            const authToken = await getAccessTokenSilently();
            setAuthToken(authToken);

            const data = await statsAPI.getMonitoringData(period);
            console.log('거래 요약 데이터:', data);
            setSalesSummary(data);
        } catch (err) {
            console.error('거래 요약 로딩 오류:', err);
            setTabError(err.message);
        } finally {
            setTabLoading(false);
        }
    };

    // 카드 클릭 핸들러
    const handleCardClick = (prompt) => {
        // 로그인 확인
        if (!isLoggedIn) {
            showError('로그인이 필요한 서비스입니다. 로그인 후 다시 시도해주세요.');
            return;
        }
        
        // prompt 객체에서 id 추출
        const promptId = prompt.id || prompt.promptId;
        if (promptId) {
            setSelectedPromptId(promptId);
            setIsModalOpen(true);
        } else {
            console.error('프롬프트 ID를 찾을 수 없습니다:', prompt);
            showError('프롬프트 정보를 불러올 수 없습니다.');
        }
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPromptId(null);
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



    // 프로필 업데이트 처리 함수
    const handleProfileUpdate = async (updateData) => {
        try {
            setUpdating(true);
            
            console.log('🔍 handleProfileUpdate 시작');
            console.log('📝 받은 updateData:', updateData);
            console.log('📝 updateData 타입 체크:', {
                profileName: typeof updateData.profileName,
                introduction: typeof updateData.introduction,
                avatarFile: typeof updateData.avatarFile,
                bannerFile: typeof updateData.bannerFile
            });

            // 인증되지 않은 경우 처리
            if (!isLoggedIn) {
                showError('로그인이 필요합니다.');
                setUpdating(false);
                return;
            }

            // 유효한 토큰 가져오기 및 설정
            const authToken = await getAccessTokenSilently();
            setAuthToken(authToken);

            // FormData로 파일과 함께 전송
            const formData = new FormData();
            formData.append('profileName', updateData.profileName);
            formData.append('introduction', updateData.introduction);
            
            // 파일이 있으면 추가
            if (updateData.avatarFile) {
                console.log('📷 아바타 파일 추가:', updateData.avatarFile);
                formData.append('profileImg', updateData.avatarFile);
            }
            if (updateData.bannerFile) {
                console.log('🖼️ 배너 파일 추가:', updateData.bannerFile);
                formData.append('bannerImg', updateData.bannerFile);
            }
            
            console.log('📤 FormData로 전송할 데이터:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `파일(${value.name})` : value);
            }
            
            // userAPI를 사용하여 프로필 업데이트
            const updatedProfile = await userAPI.updateProfile(formData);
            console.log('업데이트된 프로필 데이터:', JSON.stringify(updatedProfile, null, 2));

            // 업데이트된 프로필 정보로 상태 갱신
            setUserProfile(updatedProfile);

            // 성공 메시지 표시
            showSuccess('프로필이 성공적으로 업데이트되었습니다.');
        } catch (err) {
            console.error('프로필 업데이트 오류:', err);
            showError(`프로필 업데이트 실패: ${err.message || '알 수 없는 오류'}`);
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
                    onCardClick={handleCardClick}
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
                    onCardClick={handleCardClick}
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
                            points: userProfile?.point,
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

            {isModalOpen && (
                <PromptDetailModal
                    promptId={selectedPromptId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};
export default ProfilePage;
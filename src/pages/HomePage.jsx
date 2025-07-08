import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner/Banner';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import CategoryFilter from '../components/CategoryFilter/CategoryFilter';
import FilteredPromptList from '../components/FilteredPromptList/FilteredPromptList';
import StarryBackground from '../components/Background/StarryBackground';
import PromptDetailModal from '../components/PromptDetailModal/PromptDetailModal';
import LoginRequiredModal from '../components/auth/LoginRequiredModal';
import { promptAPI } from '../services/api';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import './HomePage.css';

const HomePage = () => {
  const [popularPrompts, setPopularPrompts] = useState([]);
  const [latestPrompts, setLatestPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ modelCategory: '', typeCategory: '' });
  
  // 페이지네이션 상태
  const [currentFilterPage, setCurrentFilterPage] = useState(0);
  const [hasMoreFiltered, setHasMoreFiltered] = useState(false);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);
  
  // 필터 적용 여부 상태 추가
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  const { loadingMessage, refreshMessage } = useLoadingMessage(true);
  const shouldShowLoading = useMinimumLoadingTime(loading, 1000); // 최소 1초 표시
  const { isLoggedIn, login } = useAuth();
  const { showError } = useAlert();

  // 카드 클릭 핸들러
  const handleCardClick = (prompt) => {
    // 로그인 확인
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
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

  // 로그인 모달 핸들러
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginRedirect = () => {
    // Auth0 로그인 실행
    login();
    // 모달 닫기
    setIsLoginModalOpen(false);
  };

  // 카테고리 필터 변경 핸들러
  const handleFilterChange = async (filter) => {
    try {
      setFilterLoading(true);
      setCurrentFilter(filter);
      setCurrentFilterPage(0);
      setIsFilterApplied(true); // 필터가 한 번 적용되었음을 표시
      
      // 전체 선택이든 특정 카테고리 선택이든 항상 API 호출
      const result = await promptAPI.filterPrompts(
        filter.modelCategory || null,
        filter.typeCategory || null,
        0, // 첫 페이지
        12 // size - 한 페이지당 12개
      );
      
      const { content, pagination } = transformBackendData(result);
      console.log('카테고리 필터링 결과:', { content, pagination });
      
      setFilteredPrompts(content);
      setHasMoreFiltered(pagination?.hasNext || false);
      setTotalFilteredCount(pagination?.totalElements || 0);
      
    } catch (err) {
      console.error('카테고리 필터링 실패:', err);
      showError('카테고리별 프롬프트를 불러오는데 실패했습니다.');
      setFilteredPrompts([]);
      setHasMoreFiltered(false);
      setTotalFilteredCount(0);
    } finally {
      setFilterLoading(false);
    }
  };

  // 더보기 버튼 핸들러
  const handleLoadMore = async () => {
    if (loadMoreLoading || !hasMoreFiltered) return;

    try {
      setLoadMoreLoading(true);
      const nextPage = currentFilterPage + 1;
      
      const result = await promptAPI.filterPrompts(
        currentFilter.modelCategory || null,
        currentFilter.typeCategory || null,
        nextPage,
        12
      );
      
      const { content, pagination } = transformBackendData(result);
      console.log('추가 페이지 로드 결과:', { content, pagination });
      
      // 기존 프롬프트에 새로운 프롬프트 추가
      setFilteredPrompts(prev => [...prev, ...content]);
      setCurrentFilterPage(nextPage);
      setHasMoreFiltered(pagination?.hasNext || false);
      
    } catch (err) {
      console.error('추가 페이지 로드 실패:', err);
      showError('추가 프롬프트를 불러오는데 실패했습니다.');
    } finally {
      setLoadMoreLoading(false);
    }
  };

  // 백엔드 데이터를 프론트엔드 구조에 맞게 변환하는 함수
  const transformBackendData = (backendData) => {
    if (!backendData) return { content: [], pagination: null };
    
    const content = backendData.content ? backendData.content.map(item => ({
      id: item.id || item.promptId,
      title: item.title || item.promptName || '제목 없음',
      description: item.description || '설명 없음',
      category: item.category || item.typeCategory || '기타',
      rating: item.rating || item.rate || 0,
      price: item.price || 0,
      author: item.author || item.ownerProfileName || '작성자 미상',
      downloads: item.downloads || item.salesCount || 0,
      tags: item.tags || item.hashTags || [],
      thumbnail: item.thumbnail || item.thumbnailImageUrl || null,
      aiInspectionRate: item.aiInspectionRate || null
    })) : [];

    const pagination = {
      currentPage: backendData.pageable?.pageNumber || 0,
      totalPages: backendData.totalPages || 0,
      totalElements: backendData.totalElements || 0,
      hasNext: !backendData.last,
      pageSize: backendData.size || 10
    };

    return { content, pagination };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        refreshMessage(); // 새로운 로딩 메시지 생성
        
        // Promise.all을 allSettled로 변경하여 일부 API 실패에 대응
        const results = await Promise.allSettled([
          promptAPI.getPopularPrompts(10),
          promptAPI.getLatestPrompts(10),
          promptAPI.filterPrompts(null, null, 0, 12) // 전체 프롬프트도 초기에 로드
        ]);

        console.log('백엔드 API 호출 결과:', results);

        const popularResult = results[0];
        const latestResult = results[1];
        const allPromptsResult = results[2];
        
        if (popularResult.status === 'fulfilled') {
          const { content: transformedPopular } = transformBackendData(popularResult.value);
          console.log('홈페이지 - 인기 프롬프트 목록:', transformedPopular.map(p => ({ id: p.id, title: p.title })));
          setPopularPrompts(transformedPopular);
        } else {
          console.error('인기 프롬프트 로드 실패:', popularResult.reason);
          setPopularPrompts([]); // 실패 시 빈 배열로 설정
        }

        if (latestResult.status === 'fulfilled') {
          const { content: transformedLatest } = transformBackendData(latestResult.value);
          console.log('홈페이지 - 최신 프롬프트 목록:', transformedLatest.map(p => ({ id: p.id, title: p.title })));
          setLatestPrompts(transformedLatest);
        } else {
          console.error('최신 프롬프트 로드 실패:', latestResult.reason);
          setLatestPrompts([]); // 실패 시 빈 배열로 설정
        }

        // 전체 프롬프트 초기 로드
        if (allPromptsResult.status === 'fulfilled') {
          const { content, pagination } = transformBackendData(allPromptsResult.value);
          console.log('홈페이지 - 전체 프롬프트 초기 로드:', content.length);
          setFilteredPrompts(content);
          setHasMoreFiltered(pagination?.hasNext || false);
          setTotalFilteredCount(pagination?.totalElements || 0);
          setIsFilterApplied(true); // 초기에 전체 프롬프트를 로드했으므로 true로 설정
        } else {
          console.error('전체 프롬프트 로드 실패:', allPromptsResult.reason);
          setFilteredPrompts([]);
          setHasMoreFiltered(false);
          setTotalFilteredCount(0);
        }
        
      } catch (err) {
        // allSettled는 자체적으로 에러를 throw하지 않지만, 다른 예외 상황을 위해 유지
        console.warn('데이터 fetching 중 예외 발생:', err.message);
        setError('데이터를 불러오는 중 예기치 않은 오류가 발생했습니다.');
        setPopularPrompts([]);
        setLatestPrompts([]);
        setFilteredPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshMessage]);

  if (shouldShowLoading) {
    return (
      <div className="home-page">
        <StarryBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-message">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <StarryBackground />
      <main className="main-content">
        <Banner />
        <div className="content-container">
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}
          
          <PromptCarousel 
            title="🔥 인기 프롬프트" 
            prompts={popularPrompts}
            onCardClick={handleCardClick}
          />
          <PromptCarousel 
            title="✨ 최신 프롬프트" 
            prompts={latestPrompts}
            onCardClick={handleCardClick}
          />
          
          {/* 카테고리 필터 섹션 */}
          <CategoryFilter 
            onFilterChange={handleFilterChange}
            loading={filterLoading}
            compact={true}
          />
          
          {/* 필터링된 프롬프트 섹션 */}
          {isFilterApplied && (
            <FilteredPromptList
              title={(!currentFilter.modelCategory && !currentFilter.typeCategory) ? "📋 모든 프롬프트" : "📋 필터링된 프롬프트"} 
              prompts={filteredPrompts}
              onCardClick={handleCardClick}
              onLoadMore={handleLoadMore}
              loading={filterLoading}
              loadMoreLoading={loadMoreLoading}
              hasMore={hasMoreFiltered}
              totalCount={totalFilteredCount}
              currentPage={currentFilterPage}
              emptyMessage={(!currentFilter.modelCategory && !currentFilter.typeCategory) ? "프롬프트가 없습니다." : "선택한 카테고리에 해당하는 프롬프트가 없습니다."}
            />
          )}
        </div>
      </main>
      
      {/* 프롬프트 상세 모달 */}
      {isModalOpen && selectedPromptId && (
        <PromptDetailModal
          promptId={selectedPromptId}
          onClose={handleCloseModal}
        />
      )}

      {isLoginModalOpen && (
        <LoginRequiredModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLoginModal}
          onLogin={handleLoginRedirect}
        />
      )}
    </div>
  );
};

export default HomePage; 
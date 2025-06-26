import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarryBackground from '../components/Background/StarryBackground';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import { promptAPI } from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  
  const { loadingMessage, refreshMessage } = useLoadingMessage(true);
  const shouldShowLoading = useMinimumLoadingTime(loading, 800);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      refreshMessage();
      
      const data = await promptAPI.searchPrompts(searchQuery);
      console.log('백엔드 응답 데이터:', data);
      
      // 백엔드 응답 구조에 맞게 데이터 추출
      const contentArray = data.content || [];
      
      // 백엔드 응답 데이터를 프론트엔드 형식으로 변환
      const transformedData = contentArray.map(item => ({
        id: item.promptId,
        title: item.promptName,
        description: item.description,
        category: item.typeCategory,
        subcategory: item.typeCategory,
        thumbnail: item.thumbnailImageUrl || `https://picsum.photos/400/300?random=${item.promptId}`,
        author: item.ownerProfileName || 'AI Assistant',
        rating: item.rate || 4.5,
        downloads: item.salesCount || Math.floor(Math.random() * 500) + 100,
        uses: item.salesCount || Math.floor(Math.random() * 500) + 100,
        price: item.price || 0,
        tags: item.hashTags || ['AI', '프롬프트']
      }));
      
      setSearchResults(transformedData);
      setTotalCount(data.totalElements || transformedData.length);
      
      // 검색 결과가 없으면 추천 프롬프트 가져오기
      if (transformedData.length === 0) {
        await fetchSuggestedPrompts(searchQuery);
      }
    } catch (err) {
      console.error('검색 오류:', err);
      setError(err.message || '검색 중 오류가 발생했습니다');
      setSearchResults([]);
      setTotalCount(0);
      // 오류 시에도 추천 프롬프트 가져오기
      await fetchSuggestedPrompts(searchQuery);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedPrompts = async (searchQuery) => {
    try {
      // 검색어의 첫 글자 추출
      const firstChar = searchQuery.charAt(0);
      
      // 첫 글자로 시작하는 프롬프트들 검색
      const data = await promptAPI.searchPrompts(firstChar);
      const contentArray = data.content || [];
      
      // 최대 6개의 추천 프롬프트만 표시
      const transformedSuggestions = contentArray.slice(0, 6).map(item => ({
        id: item.promptId,
        title: item.promptName,
        description: item.description,
        category: item.typeCategory,
        subcategory: item.typeCategory,
        thumbnail: item.thumbnailImageUrl || `https://picsum.photos/400/300?random=${item.promptId}`,
        author: item.ownerProfileName || 'AI Assistant',
        rating: item.rate || 4.5,
        downloads: item.salesCount || Math.floor(Math.random() * 500) + 100,
        uses: item.salesCount || Math.floor(Math.random() * 500) + 100,
        price: item.price || 0,
        tags: item.hashTags || ['AI', '프롬프트']
      }));
      
      setSuggestedPrompts(transformedSuggestions);
    } catch (err) {
      console.error('추천 프롬프트 가져오기 오류:', err);
      setSuggestedPrompts([]);
    }
  };

  return (
    <div className="search-page">
      <StarryBackground />
      
      <main className="search-main">
        {/* 검색 헤더 */}
        <div className="search-header">
          <div className="search-header-content">
            <h1 className="search-title">
              <span className="search-keyword">'{query}'</span> 검색 결과
            </h1>
            <div className="search-stats">
              <span className="result-count">{totalCount}개의 프롬프트</span>
            </div>
          </div>
        </div>

        {/* 검색 결과 컨테이너 */}
        <div className="search-content">
          {shouldShowLoading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">{loadingMessage}</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <h3>검색 오류</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && searchResults.length > 0 && (
            <PromptCarousel 
              title={`검색 결과 (${totalCount}개)`}
              prompts={searchResults}
            />
          )}

          {!loading && !error && searchResults.length === 0 && query && (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">🔍</div>
                <h2>혹시 이 프롬프트를 찾으셨나요?</h2>
                <p>'{query}'와 관련된 프롬프트를 찾지 못했지만, 비슷한 프롬프트들을 추천해드립니다.</p>
                
                {suggestedPrompts.length === 0 && (
                  <div className="search-suggestions">
                    <h4>다음과 같이 시도해보세요:</h4>
                    <ul>
                      <li>다른 키워드로 검색해보세요</li>
                      <li>더 간단한 단어를 사용해보세요</li>
                      <li>카테고리별로 탐색해보세요</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {suggestedPrompts.length > 0 && (
                <div className="suggested-prompts-wrapper">
                  <PromptCarousel 
                    title="추천 프롬프트"
                    prompts={suggestedPrompts}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 
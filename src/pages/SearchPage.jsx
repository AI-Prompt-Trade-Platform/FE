import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StarryBackground from '../components/Background/StarryBackground';
import PromptCard from '../components/PromptCard/PromptCard';
import './SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/home/prompts/search?keyword=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다');
      }
      
      const data = await response.json();
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
        uses: item.salesCount || Math.floor(Math.random() * 500) + 100,
        price: item.price || 0
      }));
      
      setSearchResults(transformedData);
      setTotalCount(data.totalElements || transformedData.length);
    } catch (err) {
      console.error('검색 오류:', err);
      setError(err.message || '검색 중 오류가 발생했습니다');
      setSearchResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
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
              {totalCount > 0 && (
                <>
                  <span className="stats-divider">•</span>
                  <span className="search-quality">AI 검증 완료</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 검색 결과 컨테이너 */}
        <div className="search-content">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">검색 중...</p>
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
            <div className="search-results">
              <div className="results-grid">
                {searchResults.map((prompt) => (
                  <PromptCard 
                    key={prompt.id} 
                    prompt={prompt}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && searchResults.length === 0 && query && (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">🔍</div>
                <h2>검색 결과가 없습니다</h2>
                <p>'{query}'에 대한 프롬프트를 찾을 수 없습니다.</p>
                <div className="search-suggestions">
                  <h4>다음과 같이 시도해보세요:</h4>
                  <ul>
                    <li>다른 키워드로 검색해보세요</li>
                    <li>더 간단한 단어를 사용해보세요</li>
                    <li>카테고리별로 탐색해보세요</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 
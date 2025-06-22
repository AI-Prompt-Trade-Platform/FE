import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner/Banner';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import StarryBackground from '../components/Background/StarryBackground';
import { promptAPI } from '../services/api';
import { useLoadingMessage, useMinimumLoadingTime } from '../hooks/useLoadingMessage';
import './HomePage.css';

const HomePage = () => {
  const [popularPrompts, setPopularPrompts] = useState([]);
  const [latestPrompts, setLatestPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loadingMessage, refreshMessage } = useLoadingMessage(true);
  const shouldShowLoading = useMinimumLoadingTime(loading, 1000); // 최소 1초 표시

  // 백엔드 데이터를 프론트엔드 구조에 맞게 변환하는 함수
  const transformBackendData = (backendData) => {
    if (!backendData || !backendData.content) return [];
    
    return backendData.content.map(item => ({
      id: item.id || item.promptId,
      title: item.title || item.promptName || '제목 없음',
      description: item.description || '설명 없음',
      category: item.category || item.typeCategory || '기타',
      rating: item.rating || item.rate || 0,
      price: item.price || 0,
      author: item.author || item.ownerProfileName || '작성자 미상',
      downloads: item.downloads || item.salesCount || 0,
      tags: item.tags || item.hashTags || [],
      thumbnail: item.thumbnail || item.thumbnailImageUrl || null
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        refreshMessage(); // 새로운 로딩 메시지 생성
        
        // 백엔드 API 호출 시도
        const [popularResponse, latestResponse] = await Promise.all([
          promptAPI.getPopularPrompts(8),
          promptAPI.getLatestPrompts(8)
        ]);

        console.log('백엔드 데이터 로드 성공:', { popularResponse, latestResponse });
        
        const transformedPopular = transformBackendData(popularResponse);
        const transformedLatest = transformBackendData(latestResponse);
        
        setPopularPrompts(transformedPopular);
        setLatestPrompts(transformedLatest);
        
      } catch (err) {
        console.warn('백엔드 API 호출 실패:', err.message);
        setError('데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        
        // 백엔드 연결 실패 시 빈 배열로 설정
        setPopularPrompts([]);
        setLatestPrompts([]);
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
          />
          <PromptCarousel 
            title="✨ 최신 프롬프트" 
            prompts={latestPrompts}
          />
        </div>
      </main>
    </div>
  );
};

export default HomePage; 
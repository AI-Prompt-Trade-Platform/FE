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
        
        // Promise.all을 allSettled로 변경하여 일부 API 실패에 대응
        const results = await Promise.allSettled([
          promptAPI.getPopularPrompts(8),
          promptAPI.getLatestPrompts(8)
        ]);

        console.log('백엔드 API 호출 결과:', results);

        const popularResult = results[0];
        const latestResult = results[1];
        
        if (popularResult.status === 'fulfilled') {
          const transformedPopular = transformBackendData(popularResult.value);
          setPopularPrompts(transformedPopular);
        } else {
          console.error('인기 프롬프트 로드 실패:', popularResult.reason);
          setPopularPrompts([]); // 실패 시 빈 배열로 설정
        }

        if (latestResult.status === 'fulfilled') {
          const transformedLatest = transformBackendData(latestResult.value);
          setLatestPrompts(transformedLatest);
        } else {
          console.error('최신 프롬프트 로드 실패:', latestResult.reason);
          setLatestPrompts([]); // 실패 시 빈 배열로 설정
        }
        
      } catch (err) {
        // allSettled는 자체적으로 에러를 throw하지 않지만, 다른 예외 상황을 위해 유지
        console.warn('데이터 fetching 중 예외 발생:', err.message);
        setError('데이터를 불러오는 중 예기치 않은 오류가 발생했습니다.');
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
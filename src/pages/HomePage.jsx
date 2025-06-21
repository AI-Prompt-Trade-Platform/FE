import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner/Banner';
import PromptCarousel from '../components/PromptCarousel/PromptCarousel';
import StarryBackground from '../components/Background/StarryBackground';
import { promptAPI } from '../services/api';
import './HomePage.css';

const loadingMessages = [
  'ChatGPT 일시키는 중... 🤖',
  'Sora 째직질 당하는 중... 🏃‍♂️',
  'AI가 커피 내리는 중... ☕️',
  '프롬프트를 열심히 긁어오는 중... 🧹',
  '별똥별에 소원 비는 중... 🌠',
  '서버가 열심히 달리는 중... 🚀',
  '프롬프트를 AI가 손질하는 중... ✂️',
  'GPT가 머리 굴리는 중... 🧠',
  '프롬프트에 마법 거는 중... ✨',
  'AI가 야근하는 중... 🌙',
  '서버가 스트레칭 중... 🧘‍♂️',
  '프롬프트에 영혼을 불어넣는 중... 👻',
  'GPT가 잠깐 딴짓하는 중... 😴',
  'AI가 데이터 샤워 중... 🚿',
  '프롬프트에 사랑을 담는 중... 💖',
  '서버가 커피 타임 갖는 중... ☕️',
  'AI가 영감을 찾는 중... 💡',
  '프롬프트에 버그 잡는 중... 🐛',
  'GPT가 농땡이 부리는 중... 🦥',
  'AI가 프롬프트에 주문 거는 중... 🪄'
];

const getRandomLoadingMessage = () => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};

const HomePage = () => {
  const [popularPrompts, setPopularPrompts] = useState([]);
  const [latestPrompts, setLatestPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMessage] = useState(getRandomLoadingMessage());

  // 샘플 데이터 (백엔드 연결 실패 시 사용)
  const samplePopularPrompts = [
    {
      id: 1,
      title: "창의적 글쓰기 마스터",
      description: "소설, 에세이, 시나리오 작성을 위한 전문 프롬프트",
      category: "글쓰기",
      rating: 4.8,
      price: 15000,
      author: "김작가",
      downloads: 1250,
      tags: ["창작", "소설", "시나리오"]
    },
    {
      id: 2,
      title: "마케팅 카피 생성기",
      description: "효과적인 광고 문구와 마케팅 컨텐츠 제작",
      category: "마케팅",
      rating: 4.9,
      price: 12000,
      author: "박마케터",
      downloads: 980,
      tags: ["광고", "카피", "마케팅"]
    },
    {
      id: 3,
      title: "코딩 튜터 AI",
      description: "프로그래밍 학습과 코드 리뷰를 위한 AI 어시스턴트",
      category: "개발",
      rating: 4.7,
      price: 0,
      author: "이개발자",
      downloads: 2100,
      tags: ["코딩", "프로그래밍", "학습"]
    },
    {
      id: 4,
      title: "비즈니스 전략 컨설턴트",
      description: "사업 계획 수립과 전략 분석을 도와주는 프롬프트",
      category: "비즈니스",
      rating: 4.6,
      price: 25000,
      author: "정컨설턴트",
      downloads: 750,
      tags: ["전략", "사업", "분석"]
    }
  ];

  const sampleLatestPrompts = [
    {
      id: 5,
      title: "AI 아트 디렉터",
      description: "이미지 생성 AI를 위한 상세한 프롬프트 가이드",
      category: "아트",
      rating: 4.5,
      price: 8000,
      author: "김아티스트",
      downloads: 450,
      tags: ["AI아트", "이미지", "생성"]
    },
    {
      id: 6,
      title: "언어 학습 도우미",
      description: "외국어 학습을 위한 맞춤형 대화 프롬프트",
      category: "교육",
      rating: 4.8,
      price: 10000,
      author: "이선생님",
      downloads: 680,
      tags: ["언어", "학습", "대화"]
    },
    {
      id: 7,
      title: "데이터 분석가 AI",
      description: "복잡한 데이터를 이해하기 쉽게 분석하고 설명",
      category: "데이터",
      rating: 4.9,
      price: 18000,
      author: "박분석가",
      downloads: 320,
      tags: ["데이터", "분석", "통계"]
    },
    {
      id: 8,
      title: "건강 관리 코치",
      description: "개인 맞춤형 건강 관리 조언과 운동 계획",
      category: "건강",
      rating: 4.4,
      price: 12000,
      author: "최트레이너",
      downloads: 590,
      tags: ["건강", "운동", "관리"]
    }
  ];

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
        
        // 백엔드 API 호출 시도
        const [popularResponse, latestResponse] = await Promise.all([
          promptAPI.getPopularPrompts(8),
          promptAPI.getLatestPrompts(8)
        ]);

        console.log('백엔드 데이터 로드 성공:', { popularResponse, latestResponse });
        
        const transformedPopular = transformBackendData(popularResponse);
        const transformedLatest = transformBackendData(latestResponse);
        
        setPopularPrompts(transformedPopular.length > 0 ? transformedPopular : samplePopularPrompts);
        setLatestPrompts(transformedLatest.length > 0 ? transformedLatest : sampleLatestPrompts);
        
      } catch (err) {
        console.warn('백엔드 API 호출 실패, 샘플 데이터 사용:', err.message);
        setError('백엔드 서버에 연결할 수 없어 샘플 데이터를 표시합니다.');
        
        // 백엔드 연결 실패 시 샘플 데이터 사용
        setPopularPrompts(samplePopularPrompts);
        setLatestPrompts(sampleLatestPrompts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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
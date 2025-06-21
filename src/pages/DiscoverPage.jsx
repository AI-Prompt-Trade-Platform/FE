import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/Background/StarryBackground';
import PromptCard from '../components/PromptCard/PromptCard';
import './DiscoverPage.css';

const DiscoverPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendedPrompt, setRecommendedPrompt] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 질문 데이터
  const questions = [
    {
      id: 'purpose',
      question: '어떤 목적으로 AI를 활용하고 싶으신가요?',
      options: [
        { value: 'creative', label: '창작 활동 (글쓰기, 디자인, 아이디어)', icon: '🎨' },
        { value: 'business', label: '비즈니스 (마케팅, 기획, 분석)', icon: '💼' },
        { value: 'learning', label: '학습 및 연구 (정보 수집, 요약)', icon: '📚' },
        { value: 'coding', label: '개발 및 프로그래밍', icon: '💻' },
        { value: 'personal', label: '개인적 도움 (일정, 메모, 정리)', icon: '🏠' }
      ]
    },
    {
      id: 'experience',
      question: 'AI 프롬프트 사용 경험은 어느 정도인가요?',
      options: [
        { value: 'beginner', label: '처음 사용해봅니다', icon: '🌱' },
        { value: 'intermediate', label: '가끔 사용해봤습니다', icon: '🌿' },
        { value: 'advanced', label: '자주 사용하고 있습니다', icon: '🌳' },
        { value: 'expert', label: '전문적으로 활용합니다', icon: '🏆' }
      ]
    },
    {
      id: 'style',
      question: '어떤 스타일의 결과를 선호하시나요?',
      options: [
        { value: 'detailed', label: '상세하고 구체적인', icon: '🔍' },
        { value: 'creative', label: '창의적이고 독특한', icon: '✨' },
        { value: 'professional', label: '전문적이고 공식적인', icon: '👔' },
        { value: 'casual', label: '친근하고 편안한', icon: '😊' },
        { value: 'structured', label: '체계적이고 논리적인', icon: '📊' }
      ]
    },
    {
      id: 'urgency',
      question: '얼마나 빠른 결과를 원하시나요?',
      options: [
        { value: 'instant', label: '즉시 사용 가능한', icon: '⚡' },
        { value: 'quick', label: '빠른 수정으로 사용', icon: '🚀' },
        { value: 'customizable', label: '충분한 커스터마이징', icon: '🔧' },
        { value: 'learning', label: '학습하며 천천히', icon: '🎓' }
      ]
    }
  ];

  // 데이터베이스에서 프롬프트 가져오기
  const fetchPrompts = async () => {
    try {
      // promptAPI 서비스 import
      const { promptAPI } = await import('../services/api');
      
      // 인기 프롬프트와 최신 프롬프트를 모두 가져와서 합치기
      const [popularData, latestData] = await Promise.all([
        promptAPI.getPopularPrompts(20),
        promptAPI.getLatestPrompts(20)
      ]);
      
      // 백엔드 데이터를 프론트엔드 구조에 맞게 변환
      const transformData = (backendData) => {
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
      
      const popularPrompts = transformData(popularData);
      const latestPrompts = transformData(latestData);
      
      // 중복 제거하고 합치기
      const allPrompts = [...popularPrompts];
      latestPrompts.forEach(prompt => {
        if (!allPrompts.find(p => p.id === prompt.id)) {
          allPrompts.push(prompt);
        }
      });
      
      console.log('프롬프트 데이터 로드 성공:', allPrompts.length, '개');
      return allPrompts;
    } catch (error) {
      console.error('프롬프트 데이터 가져오기 오류:', error);
      console.log('백엔드 연결 실패 - 빈 배열 반환');
      return [];
    }
  };

  // 고도화된 추천 알고리즘
  const getRecommendation = async (userAnswers) => {
    const prompts = await fetchPrompts();
    
    if (prompts.length === 0) {
      console.log('❌ 추천할 프롬프트가 없습니다.');
      return {
        id: 0,
        title: "추천 프롬프트 없음",
        description: "현재 백엔드 서버에 연결할 수 없어 프롬프트를 추천할 수 없습니다. 잠시 후 다시 시도해주세요.",
        category: "시스템",
        rating: 0,
        price: 0,
        author: "시스템",
        downloads: 0,
        tags: [],
        thumbnail: null
      };
    }

    console.log('🎯 추천 시작:', userAnswers);

    // 1. 목적별 카테고리 및 키워드 매핑 (가중치 50점)
    const purposeMapping = {
      'creative': {
        categories: ['글쓰기', '창작', '아트', '디자인', '콘텐츠'],
        keywords: ['창작', '글쓰기', '소설', '시', '에세이', '스토리텔링', '아이디어', '브레인스토밍', '창의', '상상력', '디자인', '예술', '미술', '음악', '영상', '작가', '작품', '문학', '콘텐츠', '블로그', '카피라이팅', '시나리오', '대본', '웹툰', '만화', '일러스트', '포토샵', '피그마', '그래픽', '로고', 'UI', 'UX'],
        excludeKeywords: ['개발', '프로그래밍', '코딩', '코드', '알고리즘', '데이터베이스', 'API', '서버'],
        weight: 50
      },
      'business': {
        categories: ['비즈니스', '마케팅', '경영', '전략', '기획'],
        keywords: ['비즈니스', '마케팅', '광고', '카피', '브랜딩', '전략', '기획', '분석', '보고서', '프레젠테이션', '세일즈', '고객', '수익', '성장', '투자', '경영', '관리', '리더십', '팀', '조직', '회계', '재무', '예산', '계획', '목표', 'KPI', '성과', '효율', '생산성', '창업', '사업', '컨설팅'],
        excludeKeywords: ['개발', '프로그래밍', '코딩', '이미지', '그림', '아트'],
        weight: 50
      },
      'learning': {
        categories: ['교육', '학습', '연구', '분석', '정보'],
        keywords: ['학습', '교육', '연구', '분석', '요약', '정리', '공부', '이해', '설명', '튜터', '가이드', '강의', '문제해결', '지식', '정보', '스터디', '시험', '자격증', '언어', '외국어', '영어', '독서', '책', '논문', '리서치', '조사', '데이터', '통계', '과학', '수학', '역사', '철학'],
        excludeKeywords: ['개발', '프로그래밍', '코딩', '마케팅', '광고'],
        weight: 50
      },
      'coding': {
        categories: ['개발', '프로그래밍', 'IT', '기술', '코딩', '소프트웨어'],
        keywords: ['개발', '프로그래밍', '코딩', '코드', '디버깅', '리뷰', '알고리즘', '데이터', '웹', '앱', '소프트웨어', '기술', '시스템', 'API', '데이터베이스', '백엔드', '프론트엔드', '풀스택', '자바', '파이썬', '자바스크립트', '리액트', '스프링', '노드', 'SQL', '서버', '클라우드', '배포', '테스트', '버그', '최적화', '성능', '보안', '아키텍처', '프레임워크', '라이브러리', '개발자', '엔지니어', 'DevOps', 'CI/CD', 'Git', '버전관리'],
        excludeKeywords: ['이미지', '그림', '사진', '디자인', '아트', '그래픽', '비주얼', '색상', '미술', '예술', '창작', '일러스트', '포토샵', '피그마'],
        weight: 50
      },
      'personal': {
        categories: ['라이프스타일', '개인', '일상', '관리', '건강'],
        keywords: ['개인', '일상', '라이프', '관리', '계획', '일정', '메모', '정리', '건강', '운동', '식단', '취미', '여행', '쇼핑', '가정', '습관', '루틴', '목표', '동기', '자기계발', '명상', '요가', '다이어트', '요리', '레시피', '인테리어', '청소', '정리정돈', '시간관리', '스케줄'],
        excludeKeywords: ['개발', '프로그래밍', '비즈니스', '마케팅', '학습', '교육'],
        weight: 50
      }
    };

    // 2. 경험 레벨별 난이도 매핑 (가중치 30점)
    const experienceMapping = {
      'beginner': {
        keywords: ['초보', '기초', '입문', '쉬운', '간단', '기본', '시작', '첫', '처음', '가이드', '튜토리얼'],
        difficulty: 'easy',
        weight: 30
      },
      'intermediate': {
        keywords: ['중급', '활용', '응용', '실용', '실전', '연습', '향상'],
        difficulty: 'medium',
        weight: 30
      },
      'advanced': {
        keywords: ['고급', '심화', '전문', '숙련', '능숙', '고도화', '최적화'],
        difficulty: 'hard',
        weight: 30
      },
      'expert': {
        keywords: ['전문가', '마스터', '엑스퍼트', '고수', '프로', '전문적', '고급', '심층', '완벽'],
        difficulty: 'expert',
        weight: 30
      }
    };

    // 3. 스타일별 특성 매핑 (가중치 25점)
    const styleMapping = {
      'detailed': {
        keywords: ['상세', '구체', '정확', '세밀', '완전', '철저', '꼼꼼', '정밀', '체계적', '단계별'],
        characteristics: ['precision', 'thoroughness'],
        weight: 25
      },
      'creative': {
        keywords: ['창의', '독특', '혁신', '아이디어', '상상', '독창', '새로운', '참신', '유니크', '트렌디'],
        characteristics: ['innovation', 'uniqueness'],
        weight: 25
      },
      'professional': {
        keywords: ['전문', '공식', '비즈니스', '프로', '업무', '공적', '격식', '표준', '규범'],
        characteristics: ['formality', 'business'],
        weight: 25
      },
      'casual': {
        keywords: ['친근', '편안', '간단', '쉬운', '일상', '자연', '부담없는', '가벼운', '재미있는'],
        characteristics: ['simplicity', 'friendliness'],
        weight: 25
      },
      'structured': {
        keywords: ['체계', '논리', '구조', '단계', '순서', '방법론', '프로세스', '시스템', '조직적'],
        characteristics: ['logic', 'organization'],
        weight: 25
      }
    };

    // 4. 긴급도별 특성 매핑 (가중치 20점)
    const urgencyMapping = {
      'instant': {
        keywords: ['즉시', '빠른', '신속', '간편', '바로', '즉석', '원클릭', '자동', '실시간'],
        timeframe: 'immediate',
        weight: 20
      },
      'quick': {
        keywords: ['빠른', '신속', '효율', '간단', '쉬운', '편리', '단순'],
        timeframe: 'short',
        weight: 20
      },
      'customizable': {
        keywords: ['커스텀', '맞춤', '개인화', '조정', '수정', '변경', '설정', '옵션'],
        timeframe: 'flexible',
        weight: 20
      },
      'learning': {
        keywords: ['학습', '연습', '훈련', '단계별', '점진적', '교육', '튜토리얼', '가이드'],
        timeframe: 'gradual',
        weight: 20
      }
    };

    // 점수 계산
    const scoredPrompts = prompts.map(prompt => {
      let totalScore = 0;
      const scoreBreakdown = {
        purpose: 0,
        experience: 0,
        style: 0,
        urgency: 0,
        quality: 0
      };

      const title = (prompt.title || '').toLowerCase();
      const description = (prompt.description || '').toLowerCase();
      const category = (prompt.category || '').toLowerCase();
      const tags = (prompt.tags || []).join(' ').toLowerCase();
      const fullText = `${title} ${description} ${category} ${tags}`;

      // 1. 목적 매칭
      const purposeConfig = purposeMapping[userAnswers.purpose];
      if (purposeConfig) {
        // 제외 키워드 체크 (특히 개발 카테고리에서 이미지 관련 제외)
        if (purposeConfig.excludeKeywords) {
          const excludeMatches = purposeConfig.excludeKeywords.filter(keyword => 
            fullText.includes(keyword.toLowerCase())
          ).length;
          if (excludeMatches > 0) {
            scoreBreakdown.purpose -= excludeMatches * 30; // 강한 패널티
            console.log(`❌ 제외 키워드 발견: ${prompt.title} (${excludeMatches}개)`);
          }
        }

        // 카테고리 완전 매칭
        const categoryMatch = purposeConfig.categories.some(cat => 
          category.includes(cat.toLowerCase()) || cat.toLowerCase().includes(category)
        );
        if (categoryMatch) scoreBreakdown.purpose += 30;

        // 키워드 매칭
        const keywordMatches = purposeConfig.keywords.filter(keyword => 
          fullText.includes(keyword.toLowerCase())
        ).length;
        scoreBreakdown.purpose += Math.min(keywordMatches * 5, 20);
      }

      // 2. 경험 레벨 매칭
      const experienceConfig = experienceMapping[userAnswers.experience];
      if (experienceConfig) {
        const experienceMatches = experienceConfig.keywords.filter(keyword => 
          fullText.includes(keyword.toLowerCase())
        ).length;
        scoreBreakdown.experience += Math.min(experienceMatches * 10, 30);

        // 경험 레벨 반대 패널티
        const oppositeKeywords = {
          'beginner': ['고급', '전문가', '마스터', '심화'],
          'expert': ['초보', '기초', '입문', '쉬운']
        };
        if (oppositeKeywords[userAnswers.experience]) {
          const penaltyMatches = oppositeKeywords[userAnswers.experience].filter(keyword => 
            fullText.includes(keyword.toLowerCase())
          ).length;
          scoreBreakdown.experience -= penaltyMatches * 15;
        }
      }

      // 3. 스타일 매칭
      const styleConfig = styleMapping[userAnswers.style];
      if (styleConfig) {
        const styleMatches = styleConfig.keywords.filter(keyword => 
          fullText.includes(keyword.toLowerCase())
        ).length;
        scoreBreakdown.style += Math.min(styleMatches * 8, 25);
      }

      // 4. 긴급도 매칭
      const urgencyConfig = urgencyMapping[userAnswers.urgency];
      if (urgencyConfig) {
        const urgencyMatches = urgencyConfig.keywords.filter(keyword => 
          fullText.includes(keyword.toLowerCase())
        ).length;
        scoreBreakdown.urgency += Math.min(urgencyMatches * 7, 20);
      }

      // 5. 품질 점수 (평점 + 인기도)
      scoreBreakdown.quality += (prompt.rating || 0) * 3;
      scoreBreakdown.quality += Math.min((prompt.downloads || 0) / 500, 15);

      // 총점 계산
      totalScore = Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0);

      // 보너스: 완벽한 매칭 보너스
      if (scoreBreakdown.purpose >= 25 && scoreBreakdown.experience >= 15) {
        totalScore += 20;
      }

      return {
        ...prompt,
        score: Math.max(0, totalScore),
        scoreBreakdown
      };
    });

    // 점수순 정렬
    scoredPrompts.sort((a, b) => b.score - a.score);

    // 상위 3개 중에서 랜덤 선택 (다양성 확보)
    const topCandidates = scoredPrompts.slice(0, Math.min(3, scoredPrompts.length));
    const bestMatch = topCandidates[Math.floor(Math.random() * topCandidates.length)];

    console.log('🏆 추천 결과:', {
      selected: bestMatch.title,
      score: bestMatch.score,
      breakdown: bestMatch.scoreBreakdown,
      topCandidates: topCandidates.map(p => ({ title: p.title, score: p.score }))
    });

    return bestMatch;
  };

  const handleAnswer = async (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 모든 질문 완료 - 추천 분석 시작
      setIsAnalyzing(true);
      
      setTimeout(async () => {
        const recommendation = await getRecommendation(newAnswers);
        setRecommendedPrompt(recommendation);
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendedPrompt(null);
    setIsAnalyzing(false);
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="discover-page">
      <StarryBackground />
      
      <div className="discover-container">
        {/* 헤더 */}
        <div className="discover-header">
          <h1 className="discover-title">
            <span className="title-icon">🔮</span>
            AI 프롬프트 추천 시스템
          </h1>
          <p className="discover-subtitle">
            몇 가지 질문에 답하시면 당신에게 완벽한 프롬프트를 추천해드립니다
          </p>
        </div>

        {/* 진행률 표시 */}
        {!recommendedPrompt && !isAnalyzing && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
        )}

        {/* 질문 섹션 */}
        {!recommendedPrompt && !isAnalyzing && currentQuestion && (
          <div className="question-container">
            <div className="question-card">
              <h2 className="question-title">{currentQuestion.question}</h2>
              
              <div className="options-grid">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.value}
                    className="option-button"
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                    <div className="option-glow"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 분석 중 */}
        {isAnalyzing && (
          <div className="analyzing-container">
            <div className="analyzing-animation">
              <div className="analyzer-core"></div>
              <div className="analyzer-ring ring-1"></div>
              <div className="analyzer-ring ring-2"></div>
              <div className="analyzer-ring ring-3"></div>
            </div>
            <h2 className="analyzing-title">AI가 분석 중입니다...</h2>
            <p className="analyzing-text">
              당신의 답변을 바탕으로 최적의 프롬프트를 찾고 있습니다
            </p>
          </div>
        )}

        {/* 추천 결과 */}
        {recommendedPrompt && (
          <div className="recommendation-container">
            <div className="recommendation-header">
              <h2 className="recommendation-title">
                <span className="sparkle">✨</span>
                당신을 위한 완벽한 프롬프트
                <span className="sparkle">✨</span>
              </h2>
              <p className="recommendation-subtitle">
                AI 분석 결과, 이 프롬프트가 당신에게 가장 적합합니다!
              </p>
            </div>

            <div className="recommended-prompt">
              <PromptCard prompt={recommendedPrompt} />
            </div>

            <div className="recommendation-actions">
              <button 
                className="action-button primary"
                onClick={() => {
                  navigate('/');
                  // 페이지 이동 후 상단으로 스크롤
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                더 많은 프롬프트 보기
              </button>
              <button 
                className="action-button secondary"
                onClick={resetQuiz}
              >
                다시 추천받기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage; 
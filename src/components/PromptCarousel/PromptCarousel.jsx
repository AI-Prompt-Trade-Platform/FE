import React, { useState, useRef, useEffect } from 'react';
import PromptCard from '../PromptCard/PromptCard';
import PromptDetailModal from '../PromptDetailModal/PromptDetailModal';
import './PromptCarousel.css';

const PromptCarousel = ({ prompts, title, onCardClick, emptyMessage = "✨ 표시할 프롬프트가 없습니다. ✨" }) => {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const trackRef = useRef(null);
  const maxIndex = Math.max(0, prompts.length - visibleCount);

  // const goPrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  // const goNext = () => setCurrent((prev) => Math.min(prev + 1, maxIndex));

  // 반응형 visibleCount 업데이트
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 600) setVisibleCount(1);
      else if (width < 900) setVisibleCount(2);
      else setVisibleCount(3);
    };
    
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // 마우스 휠 이벤트 리스너 등록
  useEffect(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (e.deltaY > 0) {
        // 아래로 스크롤 = 다음으로
        setCurrent((prev) => Math.min(prev + 1, maxIndex));
      } else {
        // 위로 스크롤 = 이전으로
        setCurrent((prev) => Math.max(prev - 1, 0));
      }
      
      return false;
    };

    // passive: false로 설정하여 preventDefault가 작동하도록 함
    trackElement.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      trackElement.removeEventListener('wheel', handleWheel);
    };
  }, [maxIndex]);

  const goPrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrent((prev) => Math.min(prev + 1, maxIndex));

  // 터치 이벤트 처리
  const handleTouchStart = (e) => {
    setTouchEnd(0); // 터치 시작 시 touchEnd 리셋
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goNext(); // 왼쪽으로 스와이프 = 다음으로
    } else if (isRightSwipe) {
      goPrev(); // 오른쪽으로 스와이프 = 이전으로
    }
  };

  // 프롬프트 카드 클릭 핸들러
  const handlePromptClick = (prompt) => {
    // 외부에서 전달받은 onCardClick이 있으면 사용, 없으면 기본 동작
    if (onCardClick) {
      onCardClick(prompt);
    } else {
      // 기본 동작: 모달 열기
      setSelectedPromptId(prompt.id);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setSelectedPromptId(null);
  };

  // 구매 성공 핸들러
  const handlePurchaseSuccess = (promptId) => {
    console.log('구매 성공:', promptId);
    // 필요시 상태 업데이트 로직 추가
  };

  return (
    <>
      <section className="prompt-carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
          <div className="carousel-controls">
            <button onClick={goPrev} disabled={current === 0} className="carousel-btn">◀</button>
            <button onClick={goNext} disabled={current === maxIndex} className="carousel-btn">▶</button>
          </div>
        </div>
        <div className="carousel-track-wrapper">
          {prompts && prompts.length > 0 ? (
            <div
              ref={trackRef}
              className="carousel-track"
              style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {prompts.map((prompt) => (
                <div className="carousel-slide" key={prompt.id} style={{ width: `${100 / visibleCount}%` }}>
                  <PromptCard prompt={prompt} onClick={handlePromptClick} />
                </div>
              ))}
            </div>
          ) : (
            <div className="carousel-empty">
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>
      </section>

      {/* 프롬프트 상세 모달 - onCardClick이 제공되지 않았을 때만 렌더링 */}
      {!onCardClick && selectedPromptId && (
        <PromptDetailModal
          promptId={selectedPromptId}
          onClose={handleModalClose}
          onPurchase={handlePurchaseSuccess}
        />
      )}
    </>
  );
};

export default PromptCarousel; 
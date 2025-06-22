import React, { useState, useEffect } from 'react';
import { promptAPI } from '../../services/api';
import './PromptDetailModal.css';

const PromptDetailModal = ({ promptId, onClose, onPurchase }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promptDetail, setPromptDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

  // 모달 열릴 때 배경 스크롤 막기
  useEffect(() => {
    // 현재 body의 overflow 상태 저장
    const originalOverflow = document.body.style.overflow;
    
    // 배경 스크롤 막기
    document.body.style.overflow = 'hidden';
    
    // 컴포넌트 언마운트 시 원래 상태로 복원
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    if (promptId) {
      fetchPromptData();
    }
  }, [promptId]);

  const fetchPromptData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 병렬로 데이터 요청
      const [detailResponse, reviewsResponse, aiEvaluationResponse, imagesResponse] = await Promise.allSettled([
        promptAPI.getPromptById(promptId),
        promptAPI.getPromptReviews(promptId, 0, 5),
        promptAPI.getPromptAiEvaluation(promptId),
        promptAPI.getPromptImages(promptId)
      ]);

      // 상세 정보 설정
      if (detailResponse.status === 'fulfilled') {
        setPromptDetail(detailResponse.value);
      } else {
        console.warn('프롬프트 상세 정보 로드 실패:', detailResponse.reason);
        // 샘플 데이터로 대체
        setPromptDetail({
          id: promptId,
          title: "창의적 글쓰기 마스터",
          description: "이 프롬프트는 AI를 사용하여 독특하고 창의적인 콘텐츠를 생성하는 데 도움이 됩니다. 여러 가지 설정으로 다양한 결과물을 얻을 수 있으며, 사용하기 쉽습니다.",
          content: "실제 프롬프트 내용이 여기에 표시됩니다...",
          category: "글쓰기",
          rating: 4.8,
          price: 25000,
          author: "판매자 이름",
          downloads: 1250,
          tags: ["창작", "소설", "시나리오"],
          userPurchased: false,
          thumbnail: null
        });
      }

      // 리뷰 설정
      if (reviewsResponse.status === 'fulfilled') {
        setReviews(reviewsResponse.value.content || []);
      } else {
        console.warn('리뷰 데이터 로드 실패:', reviewsResponse.reason);
        // 샘플 리뷰 데이터
        setReviews([
          {
            id: 1,
            rating: 5,
            comment: "매우 만족스러운 결과물을 얻을 수 있었습니다.",
            author: "user123",
            createdAt: "3일 전"
          },
          {
            id: 2,
            rating: 4,
            comment: "대체로 만족스럽지만 몇 가지 개선이 필요합니다.",
            author: "creator456", 
            createdAt: "1주일 전"
          },
          {
            id: 3,
            rating: 4,
            comment: "대체로 만족스럽지만 몇 가지 개선이 필요합니다.",
            author: "creator456", 
            createdAt: "1주일 전"
          },
          {
            id: 4,
            rating: 4,
            comment: "대체로 만족스럽지만 몇 가지 개선이 필요합니다.",
            author: "creator456", 
            createdAt: "1주일 전"
          }
        ]);
      }

      // AI 평가 설정
      if (aiEvaluationResponse.status === 'fulfilled') {
        setAiEvaluation(aiEvaluationResponse.value);
      } else {
        console.warn('AI 평가 데이터 로드 실패:', aiEvaluationResponse.reason);
        // 샘플 AI 평가 데이터
        setAiEvaluation({
          grade: "프리미엄",
          evaluation: "매우 효과적이고 창의적인 프롬프트입니다."
        });
      }

      // 이미지 설정
      if (imagesResponse.status === 'fulfilled') {
        setImages(imagesResponse.value || []);
      } else {
        console.warn('이미지 데이터 로드 실패:', imagesResponse.reason);
        // 샘플 이미지 데이터
        setImages([
          { id: 1, url: 'https://picsum.photos/seed/prompt1/1200/200', alt: '프롬프트 예시 이미지 1' },
          { id: 2, url: 'https://picsum.photos/seed/prompt2/1200/200', alt: '프롬프트 예시 이미지 2' },
          { id: 3, url: 'https://picsum.photos/seed/prompt3/1200/200', alt: '프롬프트 예시 이미지 3' }
        ]);
      }

    } catch (err) {
      console.error('프롬프트 데이터 로드 중 오류:', err);
      setError('프롬프트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handlePurchase = async () => {
    try {
      await promptAPI.purchasePrompt(promptId);
      onPurchase && onPurchase(promptId);
      // 구매 후 데이터 새로고침
      fetchPromptData();
    } catch (err) {
      console.error('구매 중 오류:', err);
      alert('구매 중 오류가 발생했습니다.');
    }
  };

  const handleImagePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleImageNext = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg 
        key={index}
        className={`star-icon ${index < Math.floor(rating) ? 'filled' : ''}`}
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={index < Math.floor(rating) ? "#ffd700" : "none"}
        stroke="#ffd700"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ));
  };

  if (!promptId) {
    return null;
  }

  if (loading) {
    return (
      <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`}>
        <div className="modal-content large-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>프롬프트 정보를 불러오고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={handleClose}>
        <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
          <div className="error-container">
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <button onClick={handleClose} className="btn-secondary">닫기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="modal-header">
          <h1 className="modal-title">{promptDetail?.title}</h1>
          <button className="modal-close-btn" onClick={handleClose}>닫기</button>
        </div>
        
        {/* 이미지 배너 섹션 */}
        <div className="modal-banner">
          {images.length > 0 ? (
            <div className="image-carousel">
              <img 
                src={images[currentImageIndex]?.url || '/placeholder-image.jpg'} 
                alt={images[currentImageIndex]?.alt || '프롬프트 이미지'}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {images.length > 1 && (
                <>
                  <button className="carousel-btn prev" onClick={handleImagePrevious}>‹</button>
                  <button className="carousel-btn next" onClick={handleImageNext}>›</button>
                  <div className="carousel-indicators">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="placeholder-banner">
              <div className="placeholder-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* 평점 및 AI 평가 */}
        <div className="modal-rating-section">
          <div className="rating-info">
            <span className="star">⭐</span>
            <span className="rating-text">{promptDetail?.rating || 0}/5.0</span>
          </div>
          <div className="ai-evaluation-info">
            <span>AI 등급: {aiEvaluation?.grade || 'N/A'}</span>
          </div>
        </div>

        {/* 메인 컨텐츠 - 좌우 분할 */}
        <div className="modal-content-wrapper">
          {/* 왼쪽 섹션 */}
          <div className="modal-left-section">
            {/* 프롬프트 설명 */}
            <div className="description-section">
              <h3>프롬프트 설명</h3>
              <p>{promptDetail?.description}</p>
            </div>

            {/* 구매자 리뷰 */}
            <div className="reviews-section">
              <h3>구매자 리뷰</h3>
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="review-rating">{renderStars(review.rating)}</div>
                      <div className="review-author">{review.author}</div>
                      <div className="review-date">{review.createdAt}</div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 */}
          <div className="modal-right-section">
            {/* 판매자 정보 */}
            <div className="seller-info-section">
              <h3>판매자 정보</h3>
              <div className="seller-profile">
                <div className="seller-avatar">
                  <div className="avatar-placeholder">{promptDetail?.author?.charAt(0) || 'U'}</div>
                </div>
                <div className="seller-name">{promptDetail?.author}</div>
              </div>
              
              <div className="price-info">
                <div className="price">₩ {(promptDetail?.price || 0).toLocaleString()}</div>
              </div>

              <div className="action-buttons">
                {!promptDetail?.userPurchased ? (
                  <button className="purchase-btn" onClick={handlePurchase}>
                    구매하기
                  </button>
                ) : (
                  <div className="purchased-badge">구매완료</div>
                )}
                
                <button className="wishlist-btn">
                  위시리스트에 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal; 
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { promptAPI, userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './PromptDetailModal.css';

const PromptDetailModal = ({ promptId, onClose, onPurchase }) => {
  const { user } = useAuth();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promptDetail, setPromptDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [examples, setExamples] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 모달 열릴 때 배경 스크롤 막기
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
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
      
      const promptData = await promptAPI.getPromptById(promptId);

      setPromptDetail({
        id: promptData.id,
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        price: promptData.price,
        author: promptData.ownerProfileName,
        rating: promptData.averageRating,
        userPurchased: promptData.userPurchased,
        bookmarked: promptData.bookmarked,
        ownerAuth0Id: promptData.auth0id,
      });

      if (promptData.reviews?.length > 0) {
        setReviews(promptData.reviews.map((review, index) => ({
          id: `${promptId}-review-${index}`, // 유니크 키 생성
          author: review.username,
          rating: review.rating,
          comment: review.content,
          createdAt: review.createdAt || '', // createdAt이 있을 경우를 대비
        })));
      } else {
        setReviews([]);
      }

      const gradeMap = { A: '프리미엄', B: 'Excellent', C: 'Good', D: 'Standard' };
      setAiEvaluation({
        grade: gradeMap[promptData.aiInspectionRate] || 'N/A',
      });

      if (promptData.thumbnailImageUrl) {
        setExamples([{ url: promptData.thumbnailImageUrl, type: 'image' }]);
      } else {
        // API 응답에 examples 배열이 있을 경우를 대비한 로직 (확장성)
        setExamples(promptData.examples || []);
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
    setTimeout(() => onClose(), 300);
  };

  const handlePurchase = async () => {
    try {
      await promptAPI.purchasePrompt(promptId);
      onPurchase?.(promptId);
      fetchPromptData();
    } catch (err) {
      console.error('구매 중 오류:', err);
      alert('구매 중 오류가 발생했습니다.');
    }
  };

  const handleWishlistToggle = async () => {
    if (isTogglingWishlist) return;

    setIsTogglingWishlist(true);
    try {
      await userAPI.addToWishlist(promptId); // Add/Remove API is the same

      if (promptDetail.bookmarked) {
        alert('위시리스트에서 삭제되었습니다.');
      } else {
        alert('위시리스트에 추가되었습니다.');
      }
      setPromptDetail(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
    } catch (err) {
      console.error('위시리스트 처리 중 오류:', err);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleCopyPrompt = () => {
    if (promptDetail?.content) {
      navigator.clipboard.writeText(promptDetail.content).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2초 후 초기 상태로
      }, (err) => {
        console.error('클립보드 복사 실패:', err);
        alert('프롬프트를 복사하는데 실패했습니다.');
      });
    }
  };

  const handlePrevExample = () => {
    setCurrentExampleIndex(prev => (prev === 0 ? examples.length - 1 : prev - 1));
  };

  const handleNextExample = () => {
    setCurrentExampleIndex(prev => (prev === examples.length - 1 ? 0 : prev + 1));
  };
  
  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    return 'unknown';
  };

  const renderStars = (rating, size = 16) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="star-icon filled" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    if (halfStar) {
      stars.push(
        <svg key="half" className="star-icon filled" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <defs>
            <linearGradient id={`grad${size}`}>
              <stop offset="50%" stopColor="var(--accent-color)" />
              <stop offset="50%" stopColor="#555" stopOpacity="1" />
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={`url(#grad${size})`} />
        </svg>
      );
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="star-icon" width={size} height={size} viewBox="0 0 24 24" fill="#555">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      );
    }

    return stars;
  };
  
  const getGradeClass = (grade) => {
    const gradeLower = grade?.toLowerCase() || 'none';
    if (gradeLower.includes('premium')) return 'grade-premium';
    if (gradeLower.includes('excellent')) return 'grade-excellent';
    if (gradeLower.includes('good')) return 'grade-good';
    return 'grade-standard';
  }

  // 현재 사용자가 프롬프트 소유자인지 판단
  const isOwner = user?.sub === promptDetail?.ownerAuth0Id;

  if (!promptId) return null;

  if (loading) {
    return ReactDOM.createPortal(
      <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`}>
        <div className="modal-content large-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>프롬프트 정보를 불러오고 있습니다...</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (error) {
    return ReactDOM.createPortal(
      <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={handleClose}>
        <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
          <div className="error-container">
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <button onClick={handleClose} className="btn-secondary">닫기</button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className="modal-content large-modal with-split-layout" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>×</button>

        {/* --- 왼쪽 미디어 컬럼 --- */}
        <div className="modal-media-column">
          {examples.length > 0 ? (
            <div className="example-carousel">
              {getFileType(examples[currentExampleIndex]?.url) === 'image' && (
                <img src={examples[currentExampleIndex].url} alt={`Example ${currentExampleIndex + 1}`} className="example-media" />
              )}
              {getFileType(examples[currentExampleIndex]?.url) === 'video' && (
                <video src={examples[currentExampleIndex].url} controls autoPlay muted loop className="example-media" />
              )}
              {examples.length > 1 && (
                <>
                  <button onClick={handlePrevExample} className="carousel-nav-btn prev">‹</button>
                  <button onClick={handleNextExample} className="carousel-nav-btn next">›</button>
                </>
              )}
            </div>
          ) : (
             <div className="no-media-placeholder">
                <span>예시 이미지가 없습니다.</span>
             </div>
          )}
        </div>

        {/* --- 오른쪽 정보 컬럼 --- */}
        <div className="modal-info-column">
           <div className="modal-header">
             <h1 className="modal-title">{promptDetail?.title}</h1>
           </div>

           <div className="modal-rating-section">
            <div className="rating-info">
              <div className="stars-display">
                {renderStars(promptDetail?.rating, 18)}
              </div>
              <span className="rating-text">{promptDetail?.rating?.toFixed(1) || 0}/5.0</span>
            </div>
            <div className={`grade-badge ${getGradeClass(aiEvaluation?.grade)}`}>
              AI 등급: {aiEvaluation?.grade || 'N/A'}
            </div>
           </div>

           <div className="purchase-section">
              <div className="price-info">
                <span>가격</span>
                <div className="price">₩{(promptDetail?.price || 0).toLocaleString()}</div>
              </div>
              <div className="action-buttons">
                {promptDetail?.userPurchased ? (
                  <div className="purchased-badge">구매완료</div>
                ) : (
                  <button className="purchase-btn" onClick={handlePurchase} disabled={isOwner}>
                    구매하기
                  </button>
                )}
                <button
                  className="wishlist-btn"
                  onClick={handleWishlistToggle}
                  disabled={isTogglingWishlist || isOwner}
                >
                  {isTogglingWishlist
                    ? '처리 중...'
                    : promptDetail?.bookmarked
                    ? '위시리스트 삭제'
                    : '위시리스트에 추가'}
                </button>
              </div>
            </div>

            <div className="seller-info-section">
              <h3>판매자 정보</h3>
              <div className="seller-profile">
                <div className="seller-avatar">
                  <div className="avatar-placeholder">{promptDetail?.author?.charAt(0) || 'U'}</div>
                </div>
                <span className="seller-name">{promptDetail?.author}</span>
              </div>
            </div>
            
            <div className="description-section">
              <h3>프롬프트 설명</h3>
              <p>{promptDetail?.description}</p>
            </div>

            {/* 구매자 또는 소유자일 경우 프롬프트 원본 표시 */}
            {(promptDetail?.userPurchased || isOwner) && (
              <div className="prompt-original-section">
                <h3>프롬프트 원본</h3>
                <div className="prompt-original-content-wrapper">
                  <pre className="prompt-original-content">
                    {promptDetail.content}
                  </pre>
                  <button onClick={handleCopyPrompt} className="copy-prompt-btn">
                    {isCopied ? '복사완료!' : '복사하기'}
                  </button>
                </div>
              </div>
            )}

            <div className="reviews-section">
              <h3>구매자 리뷰</h3>
              <div className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">{renderStars(review.rating)}</div>
                        <div className="review-author">{review.author}</div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-date">{review.createdAt}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-message"><p>아직 작성된 리뷰가 없습니다.</p></div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PromptDetailModal; 
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { promptAPI, userAPI, setAuthToken } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import './PromptDetailModal.css';

const PromptDetailModal = ({ promptId, onClose, onPurchase }) => {
  const { user, getAccessTokenSilently } = useAuth();
  const { showSuccess, showError } = useAlert();
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
      console.log('PromptDetailModal - API 응답 데이터:', promptData);

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

      // AI 등급 설정 - 등급과 이유 분리
      const gradeMap = { 
        'A': 'Excellent', 
        'B': 'Good', 
        'C': 'Standard', 
        'D': 'Basic'
      };
      
      // 다양한 필드명 확인
      const aiGradeData = promptData.aiInspectionRate || 
                         promptData.ai_inspection_rate || 
                         promptData.aiGrade ||
                         promptData.ai_grade ||
                         promptData.grade ||
                         promptData.aiRating ||
                         promptData.ai_rating ||
                         null;
      
      console.log('AI 등급 원본 데이터:', aiGradeData);
      
      // 등급과 이유 분리 (예: "A - 우수한 구조와 명확한 지시사항")
      let grade = 'N/A';
      let reason = '';
      
      if (aiGradeData) {
        const gradeStr = aiGradeData.toString();
        if (gradeStr.includes(' - ')) {
          const parts = gradeStr.split(' - ');
          grade = gradeMap[parts[0].trim().toUpperCase()] || parts[0].trim();
          reason = parts[1].trim();
        } else {
          // 등급만 있는 경우
          grade = gradeMap[gradeStr.trim().toUpperCase()] || gradeStr.trim();
        }
      }
      
      setAiEvaluation({
        grade: grade,
        reason: reason,
        raw: aiGradeData
      });

      if (promptData.thumbnailImageUrl) {
        console.log('🖼️ 썸네일 URL:', promptData.thumbnailImageUrl);
        console.log('🔗 URL 타입 확인:', typeof promptData.thumbnailImageUrl);
        
        // S3 URL을 CloudFront URL로 변환 (필요한 경우)
        let imageUrl = promptData.thumbnailImageUrl;
        if (imageUrl.includes('.s3.') || imageUrl.includes('s3.amazonaws.com')) {
          console.log('⚠️ S3 직접 URL 감지 - CloudFront URL로 변환 필요');
          // 여기에 CloudFront 도메인으로 변환하는 로직 추가 필요
          // 예: imageUrl = imageUrl.replace('버킷명.s3.리전.amazonaws.com', 'CloudFront도메인');
        }
        
        setExamples([{ url: imageUrl, type: 'image' }]);
      } else {
        console.log('❌ thumbnailImageUrl이 없습니다');
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
      // 1. 구매 요청 전, 인증 토큰을 가져와 API 클라이언트에 설정
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      
      // 2. 정의된 API 함수 호출
      await promptAPI.purchasePrompt(promptId);
      
      // 3. 성공 처리
      showSuccess('프롬프트 구매가 완료되었습니다!');
      onPurchase?.(promptId);
      fetchPromptData(); // 최신 데이터로 다시 로드

    } catch (err) {
      console.error('구매 중 오류:', err);
      // 사용자에게 더 친절한 오류 메시지 표시
      const errorMessage = err.message.includes('402') 
        ? '포인트가 부족합니다. 포인트를 충전해주세요.'
        : '구매 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      showError(errorMessage);
    }
  };

  const handleWishlistToggle = async () => {
    if (isTogglingWishlist) return;

    setIsTogglingWishlist(true);
    try {
      await userAPI.addToWishlist(promptId); // Add/Remove API is the same

      if (promptDetail.bookmarked) {
        showSuccess('위시리스트에서 삭제되었습니다.');
      } else {
        showSuccess('위시리스트에 추가되었습니다.');
      }
      setPromptDetail(prev => ({ ...prev, bookmarked: !prev.bookmarked }));
    } catch (err) {
      console.error('위시리스트 처리 중 오류:', err);
      showError('위시리스트 처리 중 오류가 발생했습니다.');
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
        showError('프롬프트를 복사하는데 실패했습니다.');
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
    if (gradeLower.includes('excellent')) return 'grade-excellent';
    if (gradeLower.includes('good')) return 'grade-good';
    if (gradeLower.includes('standard')) return 'grade-standard';
    if (gradeLower.includes('basic')) return 'grade-basic';
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
                <img 
                  src={examples[currentExampleIndex].url} 
                  alt={`Example ${currentExampleIndex + 1}`} 
                  className="example-media"
                  onError={(e) => {
                    console.error('🚫 이미지 로딩 실패:', e.target.src);
                    console.error('🚫 에러 상세:', e);
                    // 대체 이미지로 교체
                    e.target.src = '/default-thumbnail.png';
                    // 또는 부모 요소를 플레이스홀더로 교체
                  }}
                  onLoad={() => {
                    console.log('✅ 이미지 로딩 성공:', examples[currentExampleIndex].url);
                  }}
                />
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

           {/* AI 평가 이유 섹션 - 이유가 있을 때만 표시 */}
           {aiEvaluation?.reason && (
             <div className="ai-evaluation-section">
               <div className="ai-evaluation-reason">
                 <span className="reason-label">AI 평가:</span>
                 <span className="reason-text">{aiEvaluation.reason}</span>
               </div>
             </div>
           )}

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
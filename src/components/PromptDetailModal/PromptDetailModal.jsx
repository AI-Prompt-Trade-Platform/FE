import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { promptAPI, userAPI, setAuthToken } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
import './PromptDetailModal.css';

const PromptDetailModal = ({ promptId, onClose, onPurchase }) => {
  const { user, getAccessTokenSilently } = useAuth();
  const { showSuccess, showError, showConfirm } = useAlert();
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
  const [isDeleting, setIsDeleting] = useState(false);

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

      // AI 등급 설정 - 새로운 포맷: "[등급][이유]"
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
      
      // 등급과 이유 분리 (예: "[S][스타일과 분위기 묘사가 구체적임]")
      let grade = 'N/A';
      let reason = '';
      
      if (aiGradeData) {
        const gradeStr = aiGradeData.toString().trim();
        // 대괄호 패턴으로 등급과 이유 추출
        const match = gradeStr.match(/\[([A-Z])\]\[(.+?)\]/);
        if (match) {
          grade = match[1].toUpperCase(); // 등급 (S, A, B, C, D 등)
          reason = match[2]; // 이유
          console.log('대괄호 패턴 파싱 성공:', { grade, reason });
        } else {
          // 기존 공백 기반 파싱도 유지 (호환성)
          const parts = gradeStr.split(' ');
          if (parts.length > 0) {
            grade = parts[0].toUpperCase();
            if (parts.length > 1) {
              reason = parts.slice(1).join(' ');
            }
          }
          console.log('공백 패턴 파싱 사용:', { grade, reason });
        }
      }
      
      setAiEvaluation({
        grade: grade,
        reason: reason,
        raw: aiGradeData
      });

      // 이미지 URL 확인 - thumbnailImageUrl 우선 확인
      console.log('🔍 thumbnailImageUrl 확인:', promptData.thumbnailImageUrl);
      console.log('📄 API 응답 전체 키들:', Object.keys(promptData));

      if (promptData.thumbnailImageUrl) {
        const imageUrl = promptData.thumbnailImageUrl;
        console.log('🖼️ 썸네일 URL 발견:', imageUrl);
        console.log('🔗 URL 타입:', typeof imageUrl);
        console.log('🔗 URL 길이:', imageUrl.length);
        console.log('🔗 URL 시작 부분:', imageUrl.substring(0, 50));
        
        // URL 유효성 기본 검사
        if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
          // S3 URL을 CloudFront URL로 변환 (필요한 경우)
          let finalImageUrl = imageUrl.trim();
          if (finalImageUrl.includes('.s3.') || finalImageUrl.includes('s3.amazonaws.com')) {
            console.log('⚠️ S3 직접 URL 감지 - CloudFront URL로 변환 필요');
            // 여기에 CloudFront 도메인으로 변환하는 로직 추가 필요
            // 예: finalImageUrl = finalImageUrl.replace('버킷명.s3.리전.amazonaws.com', 'CloudFront도메인');
          }
          
          setExamples([{ url: finalImageUrl, type: 'image' }]);
          console.log('✅ 이미지 설정 완료:', finalImageUrl);
          console.log('📋 examples 배열:', [{ url: finalImageUrl, type: 'image' }]);
        } else {
          console.log('❌ 유효하지 않은 이미지 URL:', imageUrl);
          setExamples([]);
        }
      } else {
        console.log('❌ thumbnailImageUrl 필드가 없거나 빈 값입니다');
        console.log('🔍 다른 이미지 관련 필드들 확인:');
        console.log('- thumbnail:', promptData.thumbnail);
        console.log('- imageUrl:', promptData.imageUrl);
        console.log('- image:', promptData.image);
        console.log('- images:', promptData.images);
        console.log('- examples:', promptData.examples);
        setExamples([]);
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

  const handleDeletePrompt = async () => {
    if (isDeleting) return;

    // 커스텀 삭제 확인 모달
    showConfirm(
      '정말로 이 프롬프트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      '프롬프트 삭제',
      async () => {
        // 확인 버튼 클릭 시 실행
        setIsDeleting(true);
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
          
          await promptAPI.deletePrompt(promptId);
          
          handleClose(); // 모달 닫기
          
          // 커스텀 alert 모달창을 표시하고, 사용자가 닫으면 새로고침
          showSuccess('프롬프트가 성공적으로 삭제되었습니다.', '성공', () => {
            window.location.reload();
          });
          
        } catch (err) {
          console.error('프롬프트 삭제 중 오류:', err);
          showError('프롬프트 삭제 중 오류가 발생했습니다.');
        } finally {
          setIsDeleting(false);
        }
      },
      () => {
        // 취소 버튼 클릭 시 실행 (아무것도 하지 않음)
        console.log('삭제 취소됨');
      }
    );
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
    const gradeUpper = grade?.toUpperCase() || 'NONE';
    switch (gradeUpper) {
      case 'S': return 'grade-s';
      case 'A': return 'grade-a';
      case 'B': return 'grade-b';
      case 'C': return 'grade-c';
      case 'D': return 'grade-d';
      default: return 'grade-default';
    }
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
          {(() => {
            console.log('🎬 렌더링 시 examples 상태:', examples);
            console.log('📊 examples.length:', examples.length);
            if (examples.length > 0) {
              console.log('🖼️ 현재 표시할 이미지:', examples[currentExampleIndex]);
            }
            return null;
          })()}
          {examples.length > 0 ? (
            <div className="example-carousel">
              {examples[currentExampleIndex]?.type === 'image' && (
                <img 
                  src={examples[currentExampleIndex].url} 
                  alt={`Example ${currentExampleIndex + 1}`} 
                  className="example-media"
                  onError={(e) => {
                    console.error('🚫 이미지 로딩 실패:');
                    console.error('📍 실패한 URL:', e.target.src);
                    console.error('🔍 에러 이벤트:', e);
                    console.error('🌐 현재 도메인:', window.location.origin);
                    console.error('🔗 원본 URL:', examples[currentExampleIndex]?.url);
                    
                    // 네트워크 상태 확인
                    if (!navigator.onLine) {
                      console.error('📡 네트워크 연결 없음');
                    }
                    
                    // CORS 에러일 가능성 체크
                    if (e.target.src.includes('http') && !e.target.src.includes(window.location.origin)) {
                      console.error('🚨 CORS 에러 가능성: 외부 도메인 이미지');
                    }
                    
                    // 대체 이미지로 교체하지 않고 플레이스홀더 표시
                    e.target.style.display = 'none';
                    const placeholder = e.target.parentNode.querySelector('.error-placeholder');
                    if (!placeholder) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'error-placeholder';
                      errorDiv.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: #888;
                        flex-direction: column;
                        gap: 10px;
                      `;
                      errorDiv.innerHTML = `
                        <div>❌ 이미지 로딩 실패</div>
                        <div style="font-size: 0.8em; text-align: center; max-width: 300px; word-break: break-all;">
                          ${e.target.src}
                        </div>
                      `;
                      e.target.parentNode.appendChild(errorDiv);
                    }
                  }}
                  onLoad={(e) => {
                    console.log('✅ 이미지 로딩 성공:', examples[currentExampleIndex].url);
                    console.log('📏 이미지 크기:', {
                      width: e.target.naturalWidth,
                      height: e.target.naturalHeight
                    });
                    console.log('🎯 이미지 DOM 요소:', e.target);
                    console.log('📐 이미지 표시 크기:', {
                      displayWidth: e.target.clientWidth,
                      displayHeight: e.target.clientHeight,
                      offsetWidth: e.target.offsetWidth,
                      offsetHeight: e.target.offsetHeight
                    });
                    console.log('👀 이미지 가시성:', {
                      display: getComputedStyle(e.target).display,
                      visibility: getComputedStyle(e.target).visibility,
                      opacity: getComputedStyle(e.target).opacity
                    });
                  }}
                />
              )}
              {examples[currentExampleIndex]?.type === 'video' && (
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
              🤖 AI {aiEvaluation?.grade || 'N/A'}
              {aiEvaluation?.reason && (
                <span className="grade-reason"> · {aiEvaluation.reason}</span>
              )}
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
                {isOwner ? (
                  <button
                    className="delete-btn"
                    onClick={handleDeletePrompt}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중...' : '프롬프트 삭제'}
                  </button>
                ) : (
                  <button
                    className="wishlist-btn"
                    onClick={handleWishlistToggle}
                    disabled={isTogglingWishlist}
                  >
                    {isTogglingWishlist
                      ? '처리 중...'
                      : promptDetail?.bookmarked
                      ? '위시리스트 삭제'
                      : '위시리스트에 추가'}
                  </button>
                )}
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
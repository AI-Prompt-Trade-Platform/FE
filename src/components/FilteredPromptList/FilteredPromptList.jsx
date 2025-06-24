import React, { useState } from 'react';
import PromptCard from '../PromptCard/PromptCard';
import PromptDetailModal from '../PromptDetailModal/PromptDetailModal';
import './FilteredPromptList.css';

const FilteredPromptList = ({ 
  prompts, 
  title, 
  onCardClick, 
  onLoadMore,
  loading = false,
  loadMoreLoading = false,
  hasMore = false,
  totalCount = 0,
  currentPage = 0,
  emptyMessage = "프롬프트가 없습니다."
}) => {
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  // 프롬프트 카드 클릭 핸들러
  const handlePromptClick = (prompt) => {
    if (onCardClick) {
      onCardClick(prompt);
    } else {
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
  };

  return (
    <div className="filtered-prompt-list">
      {/* 헤더 섹션 */}
      <div className="list-header">
        <h2 className="list-title">{title}</h2>
        {totalCount > 0 && (
          <span className="result-count">총 {totalCount.toLocaleString()}개</span>
        )}
      </div>

      {/* 프롬프트 그리드 */}
      {prompts && prompts.length > 0 ? (
        <>
          <div className="prompt-grid">
            {prompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onClick={handlePromptClick} 
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {hasMore && (
            <div className="pagination-section">
              <button 
                className="load-more-btn"
                onClick={onLoadMore}
                disabled={loadMoreLoading}
              >
                {loadMoreLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>로딩 중...</span>
                  </>
                ) : (
                  '더보기'
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>프롬프트를 불러오는 중...</p>
            </div>
          ) : (
            <div className="empty-message">
              <div className="empty-icon">📭</div>
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* 프롬프트 상세 모달 - onCardClick이 제공되지 않았을 때만 렌더링 */}
      {!onCardClick && selectedPromptId && (
        <PromptDetailModal
          promptId={selectedPromptId}
          onClose={handleModalClose}
          onPurchase={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default FilteredPromptList; 
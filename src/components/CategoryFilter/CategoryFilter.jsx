import React, { useState } from 'react';
import { MODEL_CATEGORIES, TYPE_CATEGORIES, ALL_OPTION } from '../../constants/categories';
import './CategoryFilter.css';

const CategoryFilter = ({ onFilterChange, loading = false, compact = false }) => {
  const [selectedModel, setSelectedModel] = useState(ALL_OPTION);
  const [selectedType, setSelectedType] = useState(ALL_OPTION);

  const handleModelChange = (category) => {
    setSelectedModel(category);
    onFilterChange({
      modelCategory: category.slug,
      typeCategory: selectedType.slug
    });
  };

  const handleTypeChange = (category) => {
    setSelectedType(category);
    onFilterChange({
      modelCategory: selectedModel.slug,
      typeCategory: category.slug
    });
  };

  const modelOptions = [ALL_OPTION, ...MODEL_CATEGORIES];
  const typeOptions = [ALL_OPTION, ...TYPE_CATEGORIES];

  return (
    <div className={`category-filter ${compact ? 'compact' : ''}`}>
      <div className="filter-header">
        <h2 className="filter-title">
          {compact ? '🎯 카테고리별 검색' : '🎯 카테고리별 프롬프트'}
        </h2>
        {!compact && (
          <p className="filter-subtitle">원하는 카테고리를 선택하여 맞춤형 프롬프트를 찾아보세요</p>
        )}
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label className="filter-label">AI 모델</label>
          <div className="filter-options">
            {modelOptions.map((category) => (
              <button
                key={category.id || 'all'}
                className={`filter-btn ${selectedModel.id === category.id ? 'active' : ''}`}
                onClick={() => handleModelChange(category)}
                disabled={loading}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">콘텐츠 타입</label>
          <div className="filter-options">
            {typeOptions.map((category) => (
              <button
                key={category.id || 'all'}
                className={`filter-btn ${selectedType.id === category.id ? 'active' : ''}`}
                onClick={() => handleTypeChange(category)}
                disabled={loading}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="filter-loading">
          <div className="loading-spinner"></div>
          <span>프롬프트를 불러오는 중...</span>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 
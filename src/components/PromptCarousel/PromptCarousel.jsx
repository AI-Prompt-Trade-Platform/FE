import React, { useState } from 'react';
import PromptCard from '../PromptCard/PromptCard';
import PromptDetailModal from '../PromptDetailModal/PromptDetailModal';
import './PromptCarousel.css';

const PromptCarousel = ({ prompts, title }) => {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const visibleCount = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const maxIndex = Math.max(0, prompts.length - visibleCount);

  const goPrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrent((prev) => Math.min(prev + 1, maxIndex));

  const handleCardClick = (prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  return (
    <section className="prompt-carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <div className="carousel-controls">
          <button onClick={goPrev} disabled={current === 0} className="carousel-btn">◀</button>
          <button onClick={goNext} disabled={current === maxIndex} className="carousel-btn">▶</button>
        </div>
      </div>
      <div className="carousel-track-wrapper">
        {(!prompts || prompts.length === 0) ? (
          <div className="no-prompts-message">
            판매중인 프롬프트가 없습니다.
          </div>
        ) : (
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
          >
            {prompts.map((prompt) => (
              <div className="carousel-slide" key={prompt.id} style={{ width: `${100 / visibleCount}%` }}>
                <PromptCard prompt={prompt} onCardClick={handleCardClick} />
              </div>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <PromptDetailModal prompt={selectedPrompt} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default PromptCarousel; 
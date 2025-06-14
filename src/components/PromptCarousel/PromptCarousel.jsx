import React, { useState } from 'react';
import PromptCard from '../PromptCard/PromptCard';
import './PromptCarousel.css';

const PromptCarousel = ({ prompts, title }) => {
  const [current, setCurrent] = useState(0);
  const visibleCount = window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
  const maxIndex = Math.max(0, prompts.length - visibleCount);

  const goPrev = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const goNext = () => setCurrent((prev) => Math.min(prev + 1, maxIndex));

  if (!prompts || prompts.length === 0) {
    return (
      <section className="prompt-carousel-section">
        <div className="no-prompts-message">
          판매중인 프롬프트가 없습니다.
        </div>
      </section>
    );
  }

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
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * (100 / visibleCount)}%)` }}
        >
          {prompts.map((prompt) => (
            <div className="carousel-slide" key={prompt.id} style={{ width: `${100 / visibleCount}%` }}>
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromptCarousel; 
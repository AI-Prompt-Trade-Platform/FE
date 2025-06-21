import React from 'react';
import PromptCard from '../PromptCard/PromptCard';
import './PromptCardList.css';

const PromptCardList = ({ prompts }) => {
  return (
    <div className="prompt-card-list">
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};

export default PromptCardList; 
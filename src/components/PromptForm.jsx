import React, { useState, useEffect } from 'react';
import '../styles/Prompt.css';

export default function PromptForm({ onSubmit, initialData, onCancel }) {
    const [promptName, setPromptName] = useState('');
    const [promptContent, setPromptContent] = useState('');
    const [model, setModel] = useState('GPT-4');
    const [type, setType] = useState('일반');
    const [tags, setTags] = useState('');
    const [price, setPrice] = useState(1000);
    const [exampleContentUrl, setExampleContentUrl] = useState('');

    useEffect(() => {
        if (initialData) {
            setPromptName(initialData.promptName || '');
            setPromptContent(initialData.content || '');
            setModel(initialData.model || 'GPT-4');
            setType(initialData.type || '일반');
            setTags((initialData.tags || []).join(', '));
            setPrice(initialData.price || 1000);
            setExampleContentUrl(initialData.exampleContentUrl || '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPrompt = {
            id: initialData?.id, // ✅ 수정용 ID
            promptName,          // ✅ JSON에 맞게 보냄
            content: promptContent,
            modelCategoryId: model === 'GPT-4' ? 1 : 2,
            typeCategoryId: (() => {
                switch (type) {
                    case '질문생성': return 2;
                    case '문서작성': return 3;
                    default: return 1;
                }
            })(),
            aiInspectionRate: 'High',
            exampleContentUrl,
            price,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };


        onSubmit(newPrompt);

        if (onCancel && !initialData) onCancel();
        else {
            setPromptName('');
            setPromptContent('');
            setModel('GPT-4');
            setType('일반');
            setTags('');
            setPrice(1000);
            setExampleContentUrl('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="prompt-form">
            <h2 className="prompt-form-title">{initialData ? '프롬프트 수정' : '프롬프트 등록'}</h2>

            <input
                type="text"
                placeholder="프롬프트 이름"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
                required
            />

            <textarea
                placeholder="프롬프트 내용"
                rows={4}
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                required
            />

            <select value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="GPT-3.5">GPT-3.5</option>
                <option value="GPT-4">GPT-4</option>
            </select>

            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="일반">일반</option>
                <option value="질문생성">질문 생성</option>
                <option value="문서작성">문서 작성</option>
            </select>

            <input
                type="text"
                placeholder="태그: 쉼표로 구분"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            <input
                type="number"
                placeholder="가격"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
            />

            <input
                type="url"
                placeholder="예시 콘텐츠 URL"
                value={exampleContentUrl}
                onChange={(e) => setExampleContentUrl(e.target.value)}
                required
            />

            <div className="prompt-form-actions">
                <button type="submit" className="prompt-button-primary">
                    {initialData ? '수정' : '등록'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="prompt-button-cancel">
                        {initialData ? '수정 취소' : '등록 취소'}
                    </button>
                )}
            </div>
        </form>
    );
}

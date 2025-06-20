import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthApi } from '../hooks/useAuthApi.js';
import PromptForm from '../components/PromptForm.jsx';
import PromptList from '../components/PromptList.jsx';
import PromptDetailModal from '../components/PromptDetailModal.jsx';
import '../index.css';

const DUMMY_PROMPTS = undefined;

export default function PromptPage() {
    const [prompts, setPrompts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const { authFetch } = useAuthApi();
    const { isAuthenticated } = useAuth0();

    const fetchPromptList = useCallback(async () => {
        try {
            const data = await authFetch('/api/prompts');
            if (Array.isArray(data) && data.length > 0) {
                setPrompts([...data].reverse());
            } else {
                setPrompts([]);
            }
        } catch (error) {
            setPrompts([]);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchPromptList();
    }, []);

    const handleCreate = async (formData) => {
        try {
            await authFetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setIsCreating(false);
            await fetchPromptList();
        } catch (error) {
            setIsCreating(false);
            await fetchPromptList();
        }
    };

    const handleCancel = () => {
        setIsCreating(false);
    };

    const handleView = (prompt) => {
        setSelectedPrompt(prompt);
    };
    const handleCloseModal = () => {
        setSelectedPrompt(null);
    };

    const handlePurchase = async (prompt) => {
        try {
            await authFetch(`/api/prompts/${prompt.prompt_id}/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            await fetchPromptList();
            // 구매 후 상세 모달도 최신 데이터로 갱신
            const updated = prompts.find(p => p.prompt_id === prompt.prompt_id);
            if (updated) setSelectedPrompt({ ...updated, userPurchased: true });
        } catch (e) {
            alert('구매에 실패했습니다.');
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        if (!selectedPrompt) return;
        try {
            await authFetch(`/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    promptId: selectedPrompt.prompt_id,
                    rate: reviewData.rating,
                    reviewContent: reviewData.comment,
                }),
            });
            await fetchPromptList();
            // 리뷰 후 상세 모달도 최신 데이터로 갱신
            const updated = prompts.find(p => p.prompt_id === selectedPrompt.prompt_id);
            if (updated) setSelectedPrompt(updated);
        } catch (e) {
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12 relative z-0">
            <h1 className="text-3xl font-bold">프롬프트 페이지</h1>

            {isAuthenticated && !isCreating && (
                <button
                    onClick={() => setIsCreating(true)}
                    className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                >
                    프롬프트 등록
                </button>
            )}

            {isCreating && (
                <PromptForm
                    onSubmit={handleCreate}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-center">
                <div className="w-full max-w-6xl">
                    <PromptList
                        prompts={prompts}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onView={handleView}
                    />
                </div>
            </div>

            {selectedPrompt && (
                <PromptDetailModal
                    prompt={selectedPrompt}
                    onClose={handleCloseModal}
                    onReviewSubmit={handleReviewSubmit}
                    onPurchase={handlePurchase}
                />
            )}
        </div>
    );
} 
import React, { useState, useEffect, useCallback } from 'react'; // useCallback import
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthApi } from './hooks/useAuthApi';
import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import './index.css';

export default function App() {
    const [prompts, setPrompts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [selectedPromptId, setSelectedPromptId] = useState(null);

    const { authFetch } = useAuthApi();
    const { isAuthenticated } = useAuth0();

    // 수정: useCallback으로 함수를 감싸서 불필요한 재생성을 방지합니다.
    const fetchPromptList = useCallback(async () => {
        try {
            const data = await authFetch('/api/prompts');
            setPrompts([...data].reverse());
        } catch (error) {
            console.error('프롬프트 목록 불러오기 실패:', error);
        }
    }, [authFetch]); // authFetch가 변경될 때만 이 함수를 새로 만듭니다.

    useEffect(() => {
        if (isAuthenticated) {
            fetchPromptList();
        }
    }, [isAuthenticated, fetchPromptList]); // 수정: 의존성 배열에 fetchPromptList를 넣습니다.

    // 프롬프트 생성
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
            console.error('프롬프트 생성 실패:', error);
        }
    };

    // 프롬프트 수정
    const handleUpdate = async (formData) => {
        // 수정: 백엔드 DTO 필드명(snake_case)과 일치시킵니다.
        if (!editingPrompt || !editingPrompt.prompt_id) return;
        try {
            await authFetch(`/api/prompts/${editingPrompt.prompt_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            setIsEditing(false);
            setEditingPrompt(null);
            await fetchPromptList();
        } catch (error) {
            console.error('프롬프트 수정 실패:', error);
        }
    };

    // 프롬프트 삭제
    const handleDelete = async (prompt) => {
        // 수정: 백엔드 DTO 필드명(snake_case)과 일치시킵니다.
        if (!prompt || !prompt.prompt_id) return;
        if (window.confirm(`'${prompt.prompt_name}' 프롬프트를 정말 삭제하시겠습니까?`)) {
            try {
                await authFetch(`/api/prompts/${prompt.prompt_id}`, { method: 'DELETE' });
                await fetchPromptList();
            } catch (error) {
                console.error('삭제 실패:', error);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    // 리뷰 제출
    const handleReviewSubmit = async (promptId, reviewData) => {
        if (!isAuthenticated) {
            alert("리뷰를 작성하려면 로그인이 필요합니다.");
            return;
        }
        try {
            const requestBody = {
                promptId: Number(promptId),
                rate: Number(reviewData.rating),
                reviewContent: reviewData.comment,
            };

            await authFetch(`/api/prompts/${promptId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            await fetchPromptList();
        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    const handleEdit = (prompt) => {
        setIsCreating(false);
        setIsEditing(true);
        setEditingPrompt(prompt);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingPrompt(null);
        setIsCreating(false);
    };

    const handlePromptClick = (prompt) => {
        // 수정: 백엔드 DTO 필드명(snake_case)과 일치시킵니다.
        if (prompt && prompt.prompt_id) {
            setSelectedPromptId(prompt.prompt_id);
        }
    };

    const handleCloseModal = () => {
        setSelectedPromptId(null);
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12 relative z-0">
            <h1 className="text-3xl font-bold">프롬프트 둘러보기</h1>

            {isAuthenticated && !isCreating && !isEditing && (
                <button
                    onClick={() => { setIsCreating(true); setEditingPrompt(null); }}
                    className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                >
                    프롬프트 등록
                </button>
            )}

            {(isCreating || isEditing) && (
                <PromptForm
                    onSubmit={isEditing ? handleUpdate : handleCreate}
                    initialData={editingPrompt}
                    onCancel={handleCancel}
                />
            )}

            <div className="flex justify-center">
                <div className="w-full max-w-6xl">
                    {/* 참고: PromptList 및 PromptCard 컴포넌트도 내부적으로 snake_case 필드명을 사용하도록 수정이 필요합니다. */}
                    <PromptList
                        prompts={prompts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handlePromptClick}
                    />
                </div>
            </div>

            {selectedPromptId && (
                <PromptDetailModal
                    promptId={selectedPromptId}
                    onClose={handleCloseModal}
                    onReviewSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
}

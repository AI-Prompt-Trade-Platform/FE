import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import './index.css';

const DUMMY_PROMPTS = [
    {
        prompt_id: 1,
        prompt_name: "Cosmic Voyager Logo Prompt",
        description: "Generate stunning logos for a space exploration company. Creates a sleek, modern design with planetary rings and a stylized rocket ship. Perfect for tech startups, game studios, or any brand with a futuristic vision.",
        price: 15.99,
        author: "Star-Lord",
        created_at: "2024-05-20T10:00:00Z",
        is_purchased: false,
        reviews: [
            { review_id: 1, user: "Groot", rating: 5, comment: "I am Groot!" },
            { review_id: 2, user: "Rocket", rating: 4, comment: "Not bad, but could use more explosions." },
        ],
    },
    {
        prompt_id: 2,
        prompt_name: "Enchanted Forest Character Generator",
        description: "Create whimsical and magical characters from an enchanted forest. Generates detailed descriptions and visual concepts for fairies, elves, and talking animals. Ideal for fantasy writers and game developers.",
        price: 12.50,
        author: "Galadriel",
        created_at: "2024-05-18T14:30:00Z",
        is_purchased: true,
        reviews: [
            { review_id: 3, user: "Frodo", rating: 5, comment: "Felt like I was back in the Shire. Very magical!" },
        ],
    },
    {
        prompt_id: 3,
        prompt_name: "Cyberpunk Cityscape Prompt",
        description: "Generate breathtaking, neon-drenched cityscapes in a cyberpunk style. Produces images with towering skyscrapers, flying vehicles, and holographic advertisements. A must-have for sci-fi artists.",
        price: 25.00,
        author: "Deckard",
        created_at: "2024-05-15T09:00:00Z",
        is_purchased: false,
        reviews: [],
    },
];

export default function App() {
    const [prompts, setPrompts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log("Using dummy data for development as user is authenticated.");
            setPrompts(DUMMY_PROMPTS);
        } else {
            console.log("User not authenticated, clearing prompts.");
            setPrompts([]);
        }
    }, [isAuthenticated]);

    // 프롬프트 생성
    const handleCreate = async (formData) => {
        const newPrompt = {
            ...formData,
            prompt_id: Date.now(),
            author: 'CurrentUser',
            created_at: new Date().toISOString(),
            is_purchased: false,
            reviews: []
        };
        setPrompts(prevPrompts => [newPrompt, ...prevPrompts]);
        setIsCreating(false);
    };

    // 프롬프트 수정
    const handleUpdate = async (formData) => {
        if (!editingPrompt || !editingPrompt.prompt_id) return;
        setPrompts(prompts.map(p =>
            p.prompt_id === editingPrompt.prompt_id ? { ...p, ...formData } : p
        ));
        setIsEditing(false);
        setEditingPrompt(null);
    };

    // 프롬프트 삭제
    const handleDelete = async (prompt) => {
        if (!prompt || !prompt.prompt_id) return;
        if (window.confirm(`'${prompt.prompt_name}' 프롬프트를 정말 삭제하시겠습니까?`)) {
            setPrompts(prompts.filter(p => p.prompt_id !== prompt.prompt_id));
        }
    };

    // 구매 처리
    const handlePurchase = (promptId) => {
        const updatePrompts = (prompts) => prompts.map(p =>
            p.prompt_id === promptId ? { ...p, is_purchased: true } : p
        );
        setPrompts(updatePrompts);
        setSelectedPrompt(prev => prev ? { ...prev, is_purchased: true } : null);
    };

    // 리뷰 제출
    const handleReviewSubmit = async (promptId, reviewData) => {
        const newReview = {
            review_id: Date.now(),
            user: 'CurrentUser',
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
        };

        const updateAndSelect = (currentPrompts) => {
            const updatedPrompts = currentPrompts.map(p => {
                if (p.prompt_id === promptId) {
                    const updatedReviews = [newReview, ...(p.reviews || [])];
                    return { ...p, reviews: updatedReviews };
                }
                return p;
            });

            const newlySelectedPrompt = updatedPrompts.find(p => p.prompt_id === promptId);
            setSelectedPrompt(newlySelectedPrompt);

            return updatedPrompts;
        };

        setPrompts(updateAndSelect);
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
        if (prompt && prompt.prompt_id) {
            setSelectedPrompt(prompt);
        }
    };

    const handleCloseModal = () => {
        setSelectedPrompt(null);
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
                    <PromptList
                        prompts={prompts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handlePromptClick}
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

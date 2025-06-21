import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PromptForm from '../components/PromptForm.jsx';
import PromptList from '../components/PromptList.jsx';
import PromptDetailModal from '../components/PromptDetailModal.jsx';
import '../index.css';

const DUMMY_PROMPTS = [
    {
        prompt_id: 1,
        prompt_name: "Cosmic Voyager Logo Prompt",
        description: "Generate stunning logos for a space exploration company. Creates a sleek, modern design with planetary rings and a stylized rocket ship. Perfect for tech startups, game studios, or any brand with a futuristic vision.",
        image_url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
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
        image_url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop",
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
        image_url: "https://images.unsplash.com/photo-1526566762798-8fac9c07aa98?q=80&w=2070&auto=format&fit=crop",
        price: 25.00,
        author: "Deckard",
        created_at: "2024-05-15T09:00:00Z",
        is_purchased: false,
        reviews: [],
    },
];

export default function PromptPage() {
    const [prompts, setPrompts] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            console.log("Using dummy data for development in PromptPage.");
            setPrompts(DUMMY_PROMPTS);
        } else {
            console.log("User not authenticated, clearing prompts in PromptPage.");
            setPrompts([]);
        }
    }, [isAuthenticated]);

    const handleCreate = (formData) => {
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

    const handleCancel = () => {
        setIsCreating(false);
    };

    const handleView = (prompt) => {
        setSelectedPrompt(prompt);
    };
    const handleCloseModal = () => {
        setSelectedPrompt(null);
    };

    const handlePurchase = (promptId) => {
        const updatePrompts = (currentPrompts) => currentPrompts.map(p =>
            p.prompt_id === promptId ? { ...p, is_purchased: true } : p
        );
        setPrompts(updatePrompts);
        setSelectedPrompt(prev => prev ? { ...prev, is_purchased: true } : null);
    };

    const handleReviewSubmit = (promptId, reviewData) => {
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
                        onEdit={() => {}} // Dummy handler
                        onDelete={() => {}} // Dummy handler
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
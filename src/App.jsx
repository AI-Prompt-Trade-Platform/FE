import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PromptForm from './components/PromptForm';
import PromptList from './components/PromptList';
import PromptDetailModal from './components/PromptDetailModal';
import './index.css';

export default function App() {
    const [prompts, setPrompts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    useEffect(() => {
        fetchPromptList();
    }, []);

    const fetchPromptList = async () => {
        try {
            const res = await axios.get('/api/prompts');
            const reversed = [...res.data].reverse(); // ✅ 최신순으로 정렬
            console.log('📦 프롬프트 리스트 (최신순):', reversed);
            setPrompts(reversed);
        } catch (error) {
            console.error('프롬프트 목록 불러오기 실패:', error);
        }
    };



    const handleCreatePrompt = async (formData) => {
        try {
            if (isEditing && editingPrompt) {
                await axios.put(`/api/prompts/${editingPrompt.id}`, formData);
                setIsEditing(false);
                setEditingPrompt(null);
            } else {
                await axios.post('/api/prompts', formData);   // ✅ 등록
                setIsCreating(false);                         // ✅ 폼 닫기
            }

            await fetchPromptList();  // ✅ 리스트 다시 불러오기
        } catch (error) {
            console.error('프롬프트 저장 실패:', error);
        }
    };


    const handleEdit = (prompt) => {
        setIsEditing(true);
        setEditingPrompt(prompt);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/prompts/${id}`);
            await fetchPromptList();
        } catch (error) {
            console.error('삭제 실패:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingPrompt(null);
        setIsCreating(false);
    };

    const handlePromptClick = (prompt) => {
        setSelectedPrompt(prompt);
    };

    const handleCloseModal = () => {
        setSelectedPrompt(null);
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 py-10 space-y-12 relative z-0">
            <h1 className="text-3xl font-bold">프롬프트 둘러보기</h1>

            {!isCreating && !isEditing && (
                <button
                    onClick={() => setIsCreating(true)}
                    className="mb-4 px-4 py-2 bg-yellow-400 text-black rounded"
                >
                    등록
                </button>
            )}

            {(isCreating || isEditing) && (
                <PromptForm
                    onSubmit={handleCreatePrompt}
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
                />
            )}
        </div>
    );
}

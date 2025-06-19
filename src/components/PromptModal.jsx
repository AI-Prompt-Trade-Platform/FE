import React from 'react';

export default function PromptModal({ open, onClose, prompt, onViewDetail }) {
    if (!open || !prompt) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-xl"
                    aria-label="닫기"
                >
                    ×
                </button>

                {/* 제목 */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {prompt.title || '제목 없음'}
                </h2>

                {/* 본문 내용 */}
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt.content || '내용 없음'}
                </p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mt-4">
                {prompt.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* 하단 버튼 */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => {
                            onClose();
                            onViewDetail(prompt);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                        자세히 보기 →
                    </button>
                </div>
            </div>
        </div>
    );
}

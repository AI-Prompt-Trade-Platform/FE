import React from 'react';
import PromptCard from './PromptCard';

export default function PromptList({ prompts, onEdit, onDelete, onView }) {
    if (!Array.isArray(prompts) || prompts.length === 0) {
        return <div className="text-gray-400 text-center py-8">프롬프트가 없습니다.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, idx) => {
                // key: camelCase 우선, 없으면 snake_case, 둘 다 없으면 idx
                const key = prompt.promptId || prompt.prompt_id || idx;
                // 데이터 구조 오류 디버깅 메시지
                if (!prompt.promptId && !prompt.prompt_id) {
                    return (
                        <div key={idx} className="border border-red-400 bg-black text-red-300 p-4 rounded-lg">
                            <b>[디버깅] 데이터 구조 오류</b><br />
                            필수 항목(prompt_id, promptId)이 없습니다.<br />
                            수신된 데이터 전체:<br />
                            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(prompt, null, 2)}</pre>
                        </div>
                    );
                }
                return (
                    <PromptCard
                        key={key}
                        prompt={prompt}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                    />
                );
            })}
        </div>
    );
}

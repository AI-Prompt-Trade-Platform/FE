// 모델 카테고리
export const MODEL_CATEGORIES = [
  { id: 1, name: 'gpt-4o', slug: 'gpt-4o' },
  { id: 2, name: 'Midjourney', slug: 'midjourney' },
  { id: 3, name: 'gemini 2.5 Pro', slug: 'gemini-2-5-pro' },
];

// 타입 카테고리
export const TYPE_CATEGORIES = [
  { id: 1, name: '텍스트', slug: 'text-generation' },
  { id: 2, name: '이미지 생성', slug: 'image-generation' },
  { id: 3, name: '영상 생성', slug: 'video-generation' },
];

// 전체 카테고리 옵션 (필터에서 '전체' 선택용)
export const ALL_OPTION = { id: null, name: '전체', slug: '' }; 
import { useState, useEffect, useCallback } from 'react';

const loadingMessages = [
  'ChatGPT 일시키는 중... 🤖',
  'Sora 째직질 당하는 중... 🏃‍♂️',
  'AI가 커피 내리는 중... ☕️',
  '프롬프트를 열심히 긁어오는 중... 🧹',
  '별똥별에 소원 비는 중... 🌠',
  '서버가 열심히 달리는 중... 🚀',
  '프롬프트를 AI가 손질하는 중... ✂️',
  'GPT가 머리 굴리는 중... 🧠',
  '프롬프트에 마법 거는 중... ✨',
  'AI가 야근하는 중... 🌙',
  '서버가 스트레칭 중... 🧘‍♂️',
  '프롬프트에 영혼을 불어넣는 중... 👻',
  'GPT가 잠깐 딴짓하는 중... 😴',
  'AI가 데이터 샤워 중... 🚿',
  '프롬프트에 사랑을 담는 중... 💖',
  '서버가 커피 타임 갖는 중... ☕️',
  'AI가 영감을 찾는 중... 💡',
  '프롬프트에 버그 잡는 중... 🐛',
  'GPT가 농땡이 부리는 중... 🦥',
  'AI가 프롬프트에 주문 거는 중... 🪄'
];

const getRandomLoadingMessage = () => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};

export const useLoadingMessage = (refreshOnChange = false) => {
  const [loadingMessage, setLoadingMessage] = useState(getRandomLoadingMessage());
  
  // 새로운 랜덤 메시지를 가져오는 함수
  const refreshMessage = useCallback(() => {
    setLoadingMessage(getRandomLoadingMessage());
  }, []);

  // refreshOnChange가 true이면 컴포넌트가 마운트될 때마다 새 메시지 생성
  useEffect(() => {
    if (refreshOnChange) {
      refreshMessage();
    }
  }, [refreshOnChange, refreshMessage]);
  
  return {
    loadingMessage,
    getRandomLoadingMessage,
    refreshMessage
  };
};

// 로딩 상태에 최소 표시 시간을 적용하는 훅
export const useMinimumLoadingTime = (isLoading, minTime = 800) => {
  const [shouldShowLoading, setShouldShowLoading] = useState(isLoading);
  
  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      setShouldShowLoading(true);
    } else {
      // 로딩이 끝났을 때 최소 시간만큼 더 표시
      timeoutId = setTimeout(() => {
        setShouldShowLoading(false);
      }, minTime);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, minTime]);
  
  return shouldShowLoading;
};

export default useLoadingMessage; 
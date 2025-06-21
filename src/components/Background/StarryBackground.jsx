import React, { useEffect, useState } from 'react';
import './StarryBackground.css';

const TRAIL_COUNT = 8; // 꼬리 잔상 개수
const STAR_COUNT = 60; // 고정 별 개수

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const StarryBackground = () => {
  const [meteors, setMeteors] = useState([]);
  // 별의 위치/애니메이션 정보 미리 생성
  const [stars] = useState(() =>
    Array.from({ length: STAR_COUNT }).map(() => ({
      left: getRandom(0, 100),
      top: getRandom(0, 100),
      size: getRandom(1, 2.5),
      duration: getRandom(1.5, 4),
      delay: getRandom(0, 3),
    }))
  );

  useEffect(() => {
    // 별똥별 생성
    const generateMeteor = () => {
      const meteor = {
        id: Math.random(),
        right: Math.random() * 30, // 오른쪽에서 시작
        animationDuration: Math.random() * 3 + 2, // 2-5초
        size: Math.random() * 3 + 2, // 2-5px
        delay: Math.random() * 2
      };
      setMeteors(prev => [...prev, meteor]);
      setTimeout(() => {
        setMeteors(prev => prev.filter(m => m.id !== meteor.id));
      }, (meteor.animationDuration + meteor.delay) * 1000);
    };
    const interval = setInterval(generateMeteor, 1500);
    for (let i = 0; i < 8; i++) {
      setTimeout(generateMeteor, i * 300);
    }
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="starry-background">
      {/* 고정 별들 */}
      <div className="twinkle-stars">
        {stars.map((star, i) => (
          <span
            key={i}
            className="twinkle-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      {/* 별똥별들 */}
      <div className="meteors">
        {meteors.map((meteor) => (
          <div
            key={meteor.id}
            className="meteor-group"
            style={{ right: `${meteor.right}%` }}
          >
            {/* 꼬리(잔상) */}
            {Array.from({ length: TRAIL_COUNT }).map((_, idx) => {
              const trailRatio = idx / TRAIL_COUNT;
              return (
                <span
                  key={idx}
                  className="meteor-trail"
                  style={{
                    width: `${meteor.size * (1 - trailRatio * 0.5)}px`,
                    height: `${meteor.size * (1 - trailRatio * 0.5)}px`,
                    opacity: 0.25 * (1 - trailRatio),
                    filter: `blur(${2 + 6 * trailRatio}px)`,
                    animationDelay: `${meteor.delay + trailRatio * 0.1}s`,
                    animationDuration: `${meteor.animationDuration}s`,
                    top: 0,
                    left: 0,
                  }}
                />
              );
            })}
            {/* 머리 */}
            <span
              className="meteor-head"
              style={{
                width: `${meteor.size}px`,
                height: `${meteor.size}px`,
                animationDelay: `${meteor.delay}s`,
                animationDuration: `${meteor.animationDuration}s`,
                top: 0,
                left: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarryBackground; 
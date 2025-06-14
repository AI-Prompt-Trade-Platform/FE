import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary";
import SalesChart from "./SalesChart";
import PromptCarousel from "../PromptCarousel/PromptCarousel";


const monitoringStyle = {
  width: "100%",
  margin: "auto"
}


function SalesSummaryContainer() {
  const [summary, setSummary] = useState({
    thisMonthProfit: 0,
    totalSalesCount: 0,
    avgRate: null,
  });
  const [period, setPeriod] = useState("MONTH");
  const [dailyProfit, setDailyProfit] = useState([]);
  const [popularPrompts, setPopularPrompts] = useState([]);

  // 인기 프롬프트 데이터를 가져오는 함수 (테스트를 위해 더미 데이터 사용)
  const fetchPopularPrompts = async () => {
    try {
      // 실제 API 호출 로직을 여기에 추가 (서비스 직전에 아래 주석 해제 및 수정)
      // const response = await fetch('http://localhost:8080/api/prompts/popular');
      // const data = await response.json();
      // setPopularPrompts(data);

      // 현재는 더미 데이터를 사용 (테스트 중 유지)
      const samplePopularPrompts = [
        {
          id: 1,
          title: "창의적 글쓰기 마스터",
          description: "소설, 에세이, 시나리오 작성을 위한 전문 프롬프트",
          category: "글쓰기",
          rating: 4.8,
          price: 15000,
          author: "김작가",
          downloads: 1250,
          tags: ["창작", "소설", "시나리오"]
        },
        {
          id: 2,
          title: "마케팅 카피 생성기",
          description: "효과적인 광고 문구와 마케팅 컨텐츠 제작",
          category: "마케팅",
          rating: 4.9,
          price: 12000,
          author: "박마케터",
          downloads: 980,
          tags: ["광고", "카피", "마케팅"]
        },
        {
          id: 3,
          title: "코딩 튜터 AI",
          description: "프로그래밍 학습과 코드 리뷰를 위한 AI 어시스턴트",
          category: "개발",
          rating: 4.7,
          price: 0,
          author: "이개발자",
          downloads: 2100,
          tags: ["코딩", "프로그래밍", "학습"]
        },
        {
          id: 4,
          title: "비즈니스 전략 컨설턴트",
          description: "사업 계획 수립과 전략 분석을 도와주는 프롬프트",
          category: "비즈니스",
          rating: 4.6,
          price: 25000,
          author: "정컨설턴트",
          downloads: 750,
          tags: ["전략", "사업", "분석"]
        }
      ];
      setPopularPrompts(samplePopularPrompts);
    } catch (error) {
      console.error("인기 프롬프트 데이터를 가져오는 중 오류 발생:", error);
    }
  };
  const [sellingPrompts, setSellingPrompts] = useState([]);

// 프롬프트 더미데이터 ===================================
  useEffect(() => {
    fetchPopularPrompts(); // 더미 데이터 로드를 위해 유지
  }, []);
//===================================================


  useEffect(() => {
    const userToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

    fetch(`http://localhost:8080/api/mypage/monitoring?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": userToken ? `Bearer ${userToken}` : "" // 토큰이 있으면 추가, 없으면 빈 문자열
        "Authorization": "" // 토큰이 있으면 추가, 없으면 빈 문자열
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          thisMonthProfit: data.thisMonthProfit,
          totalSalesCount: data.totalSalesCount,
          avgRate: data.avgRate,
        });
        setDailyProfit(data.dailyProfit || []);
        setSellingPrompts(data.sellingPrompts || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [period]);

  return (
    <div style={monitoringStyle}>
      {/* 네비게이션바 컴포넌트 */}
        <p style={{ fontSize: "3rem", textAlign: "left", color: "white", fontWeight: "bold", marginTop: "20px", marginBottom: "20px" }}>
          수익 모니터링
        </p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{
            background: "#232323",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "1rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="MONTH">이번달</option>
          <option value="HALF_YEAR">6개월</option>
          <option value="YEAR">1년</option>
        </select>
      </div>
      <SalesSummary
        thisMonthProfit={summary.thisMonthProfit}
        totalSalesCount={summary.totalSalesCount}
        avgRate={summary.avgRate}
        period={period}
      />
      <SalesChart data={dailyProfit} period={period} />
      {/* <PromptCarousel title="판매중인 프롬프트" prompts={sellingPrompts} /> */}
      {/* <h2 className="carousel-title" style={{textAlign: "left", color: "white", fontWeight: "bold", marginTop: "20px", marginBottom: "20px" }}>판매중인 프롬프트</h2> */}
      <PromptCarousel title="판매중인 프롬프트" prompts={popularPrompts} />
    </div>
  );
}

export default SalesSummaryContainer;
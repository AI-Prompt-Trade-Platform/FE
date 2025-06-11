import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary";


//요약페이지의 컴포넌트에 api데이터 전달 위한 컨테이너 컴포넌트
function SalesSummaryContainer() {
  const [summary, setSummary] = useState({
    thisMonthProfit: 0,
    totalSalesCount: 0,
    avgRate: null,
  });
  const [period, setPeriod] = useState("MONTH");

  useEffect(() => {
    fetch(`http://localhost:8080/api/monitoring/user?period=${period}`) //API데이터 요청
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          thisMonthProfit: data.thisMonthProfit,
          totalSalesCount: data.totalSalesCount,
          avgRate: data.avgRate,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [period]);

  return (
    <div style={{ width: "1000px" }}>
      {/* 조회기간 선택 드롭다운 상단 우측에 배치 */}
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
      />
    </div>
  );
}

export default SalesSummaryContainer;
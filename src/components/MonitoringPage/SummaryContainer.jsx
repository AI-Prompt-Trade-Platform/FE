import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary"; // 위에서 만든 컴포넌트

function SalesSummaryContainer() {
  const [summary, setSummary] = useState({
    thisMonthProfit: 0,
    totalSalesCount: 0,
    avgRate: null,
  });

  useEffect(() => {
    // 실제 API 주소로 변경 필요
    fetch("http://localhost:8080/api/monitoring/user")
      .then((res) => res.json())
      .then((data) => {
        setSummary({
          thisMonthProfit: data.thisMonthProfit,
          totalSalesCount: data.totalSalesCount,
          avgRate: data.avgRate,
        });
      })
      .catch((err) => {
        // 에러 처리
        console.error(err);
      });
  }, []);

  return (
    <SalesSummary
      thisMonthProfit={summary.thisMonthProfit}
      totalSalesCount={summary.totalSalesCount}
      avgRate={summary.avgRate}
    />
  );
}

export default SalesSummaryContainer;
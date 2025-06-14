import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary";
import SalesChart from "./SalesChart";


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
  const [dailyProfit, setDailyProfit] = useState([]); //서비스땐 이거 사용


  useEffect(() => {
    fetch(`http://localhost:8080/api/mypage/monitoring?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNVMDZpVk9hQmlpdUNhbVp6aWstTiJ9.eyJpc3MiOiJodHRwczovL2Rldi1xNjRyMG4wYmx6aGlyNnkwLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJYQTY2ZEo1cWNXcVhGcVNISzB2dmNZYlFraHppWG5CT0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9hcGkucHJ1bXB0LmxvY2FsIiwiaWF0IjoxNzQ5NjkxNDQ2LCJleHAiOjE3NDk3Nzc4NDYsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlhBNjZkSjVxY1dxWEZxU0hLMHZ2Y1liUWtoemlYbkJPIn0.bbdASEovR4nxxSPjnQgJEglj5TDpelIHQjFmbpstNU59pcSP1QTShI7fnSNgb1hIRBpXGWR-8JWKqe8ufvnNgN_5JPojxZEAodnhT2i0P3MJUeLVzsQhXAjOokSLz6GN6Xe7LK6u_FT2Y888Uz7hjOk6ZqOwGkyE8Gjsy42isPtlqe0u8ezNLrkHdm1zV4NB4TkkHWJYVqEMlEzn9TGPisy83WwJ_OhLEz9R19vMDwJ493DezqllhKOlgpwphxptpY0Vx5RIf2SWgz05Try1m_o8l6LLUAhsf3bWjd5FCasTVDGRXFO1QvYSDuy7RPtxY21QFc1wxgVQXQ2KF3TChA" // 여기에 실제 토큰 문자열 입력
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
    </div>
  );
}

export default SalesSummaryContainer;
import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary";
import SalesChart from "./SalesChart";

function SalesSummaryContainer() {
  const [summary, setSummary] = useState({
    thisMonthProfit: 0,
    totalSalesCount: 0,
    avgRate: null,
  });
  const [period, setPeriod] = useState("MONTH");

  //더미데이터 세트 (테스트용) =======================================
  const dummyData3 = [
    { userId: 7, summaryDate: "2025-05-10", totalRevenue: 12000 },
    { userId: 7, summaryDate: "2025-05-11", totalRevenue: 9000 },
    { userId: 7, summaryDate: "2025-05-12", totalRevenue: 15000 },
  ];
  const dummyData7 = [
    { userId: 7, summaryDate: "2025-05-06", totalRevenue: 8000 },
    { userId: 7, summaryDate: "2025-05-07", totalRevenue: 11000 },
    { userId: 7, summaryDate: "2025-05-08", totalRevenue: 7000 },
    { userId: 7, summaryDate: "2025-05-09", totalRevenue: 13000 },
    { userId: 7, summaryDate: "2025-05-10", totalRevenue: 12000 },
    { userId: 7, summaryDate: "2025-05-11", totalRevenue: 9000 },
    { userId: 7, summaryDate: "2025-05-12", totalRevenue: 15000 },
  ];
  const dummyData13 = [
    { userId: 7, summaryDate: "2025-04-30", totalRevenue: 5000 },
    { userId: 7, summaryDate: "2025-05-01", totalRevenue: 6000 },
    { userId: 7, summaryDate: "2025-05-02", totalRevenue: 8000 },
    { userId: 7, summaryDate: "2025-05-03", totalRevenue: 11000 },
    { userId: 7, summaryDate: "2025-05-04", totalRevenue: 7000 },
    { userId: 7, summaryDate: "2025-05-05", totalRevenue: 13000 },
    { userId: 7, summaryDate: "2025-05-06", totalRevenue: 8000 },
    { userId: 7, summaryDate: "2025-05-07", totalRevenue: 11000 },
    { userId: 7, summaryDate: "2025-05-08", totalRevenue: 7000 },
    { userId: 7, summaryDate: "2025-05-09", totalRevenue: 13000 },
    { userId: 7, summaryDate: "2025-05-10", totalRevenue: 12000 },
    { userId: 7, summaryDate: "2025-05-11", totalRevenue: 9000 },
    { userId: 7, summaryDate: "2025-05-12", totalRevenue: 15000 },
  ];
  const [dummyType, setDummyType] = useState("7"); //테스트용
//============================================================================

  // const [dailyProfit, setDailyProfit] = useState([]); //서비스땐 이거 사용


  useEffect(() => {
    fetch(`http://localhost:8080/api/monitoring/user?period=${period}`)
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

  //더미데이터 테스트용 ===============================
  let chartData = dummyData7;
  if (dummyType === "3") chartData = dummyData3;
  if (dummyType === "13") chartData = dummyData13;
  //==============================================


  return (
    <div style={{ width: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>

    {/* 더미데이터 선택용 드랍다운 (테스트용) ============================*/}
      <select
    value={dummyType}
    onChange={e => setDummyType(e.target.value)}
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
    <option value="3">3일 더미</option>
    <option value="7">7일 더미</option>
    <option value="13">13일 더미</option>
  </select>
   {/* =========================================================== */}

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
      {/* <SalesChart data={dailyProfit} />  */}
      <SalesChart data={chartData} />
      {/* 여기에 아마 판매중인프롬프트 캐러샐 들어갈듯 */}
    </div>
  );
}

export default SalesSummaryContainer;
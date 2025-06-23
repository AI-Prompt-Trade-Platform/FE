import React, { useState, useEffect } from "react";
import SalesSummary from "./SalesSummary";
import SalesChart from "./SalesChart";
import PromptCardList from "../PromptList/PromptCardList";
import { userAPI, statsAPI } from "../../services/api";





function SalesSummaryContainer() {
  const [summary, setSummary] = useState({
    thisMonthProfit: 0,
    totalSalesCount: 0,
    avgRate: null,
  });
  const [period, setPeriod] = useState("MONTH");
  const [dailyProfit, setDailyProfit] = useState([]);
  const [sellingPrompts, setSellingPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 두 API를 동시에 호출
        const [monitoringData, sellingHistory] = await Promise.all([
          statsAPI.getMonitoringData(period),
          userAPI.getSellingHistory(0, 100)
        ]);

        // 모니터링 데이터 상태 업데이트
        if (monitoringData) {
          setSummary({
            thisMonthProfit: monitoringData.thisMonthProfit || 0,
            totalSalesCount: monitoringData.totalSalesCount || 0,
            avgRate: monitoringData.avgRate || null,
          });
          setDailyProfit(monitoringData.dailyProfit || []);
        }

        // 판매중인 프롬프트 상태 업데이트
        setSellingPrompts(sellingHistory?.content || []);

      } catch (error) {
        console.error("데이터 로드 중 오류:", error);
        setSellingPrompts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <div className="monitoring-summary-container">
      <h1 className="monitoring-title">
        수익 모니터링
      </h1>
      <div className="period-selector-container">
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="period-selector"
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
      <h2 className="section-title">판매중인 프롬프트</h2>
      {isLoading ? (
        <div className="loading-message">데이터를 불러오는 중...</div>
      ) : sellingPrompts.length > 0 ? (
        <PromptCardList prompts={sellingPrompts} />
      ) : (
        <div className="empty-message">
          판매중인 프롬프트가 없습니다.
        </div>
      )}
    </div>
  );
}

export default SalesSummaryContainer;
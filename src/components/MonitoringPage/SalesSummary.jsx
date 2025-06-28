import React, { useState, useMemo, useEffect } from "react";
import "./SalesSummary.css"; // CSS 파일 임포트

function SalesSummary({ thisMonthProfit, totalSalesCount, avgRate, period }) {
  const formatNumber = (num) => (num !== undefined && num !== null ? num.toLocaleString("ko-KR") : "0");
  
  // 안전한 평점 포맷팅 함수 (RateAvgDto 객체 처리)
  const formatRate = (rateDto) => {
    if (!rateDto || rateDto.rateAvg === undefined || rateDto.rateAvg === null) return "0.0";
    const numRate = Number(rateDto.rateAvg);
    if (isNaN(numRate)) return "0.0";
    return numRate.toFixed(1);
  };

  // 기간에 따른 제목 설정
  let incomeTitle = "수익";
  let salesCountTitle = "판매 건수";
  let avgRateTitle = "평균 평점";

  if (period === "HALF_YEAR") {
    incomeTitle = "6개월 수익";
    salesCountTitle = "6개월 판매";
    avgRateTitle = "6개월 평점";
  } else if (period === "YEAR") {
    incomeTitle = "1년 수익";
    salesCountTitle = "1년 판매";
    avgRateTitle = "1년 평점";
  }

  return (
    <div className="sales-summary-container">
      {/* 하단: 요약 정보 */}
      <div className="sales-summary-content">
        {/* 이번달 총 수입 */}
        <div className="summary-item">
          <div className="summary-item-title">{incomeTitle}</div>
          <div className="summary-item-value">
            ₩ {formatNumber(thisMonthProfit)}
          </div>
        </div>
        {/* 총 판매 건수 */}
        <div className="summary-item">
          <div className="summary-item-title">{salesCountTitle}</div>
          <div className="summary-item-value">
            {formatNumber(totalSalesCount)}건
          </div>
        </div>
        {/* 평균 평점 */}
        <div className="summary-item">
          <div className="summary-item-title">{avgRateTitle}</div>
          <div className="summary-item-value">
            {formatRate(avgRate)}/5.0
          </div>
        </div>
      </div>
    </div>
  );
}
export default SalesSummary;
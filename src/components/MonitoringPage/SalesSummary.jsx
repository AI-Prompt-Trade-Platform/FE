import React, { useState, useMemo, useEffect } from "react";

function SalesSummary({ thisMonthProfit, totalSalesCount, avgRate }) {
  const formatNumber = (num) => (num !== undefined && num !== null ? num.toLocaleString("ko-KR") : "0");

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#181818", padding: "20px", width: "1000px", fontSize: "16px", borderRadius: "12px" }}>
      {/* 하단: 요약 정보 */}
      <div style={{ display: "flex", gap: "16px" }}>
        {/* 이번달 총 수입 */}
        <div style={{ flex: 1, background: "#232323", borderRadius: "12px", padding: "24px" }}>
          <div style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "12px" }}>이번달 총 수입</div>
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>
            ₩ {formatNumber(thisMonthProfit)}
          </div>
        </div>
        {/* 총 판매 건수 */}
        <div style={{ flex: 1, background: "#232323", borderRadius: "12px", padding: "24px" }}>
          <div style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "12px" }}>총 판매 건수</div>
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>
            {formatNumber(totalSalesCount)}건
          </div>
        </div>
        {/* 평균 평점 */}
        <div style={{ flex: 1, background: "#232323", borderRadius: "12px", padding: "24px" }}>
          <div style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "12px" }}>평균 평점</div>
          <div style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>
            {(avgRate !== undefined && avgRate !== null ? avgRate.toFixed(1) : "0.0")}/5.0
          </div>
        </div>
      </div>
    </div>
  );
}
export default SalesSummary;
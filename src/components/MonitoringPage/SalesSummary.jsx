import React, { useState, useMemo, useEffect } from "react";

function SalesSummary({ thisMonthProfit, totalSalesCount, avgRate }) {
    // 숫자에 콤마 추가
    const formatNumber = (num) => num?.toLocaleString("ko-KR");
  
    return (
      <div style={{ display: "flex", gap: "16px", background: "#181818", padding: "20px" }}>
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
            {avgRate ? avgRate.toFixed(1) : "-"}/5.0
          </div>
        </div>
      </div>
    );
  }
  
  export default SalesSummary;
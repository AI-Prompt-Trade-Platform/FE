import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";
import StarryBackground from "../components/mainBackground/StarryBackground"


const mainColor = {
  background: "#181818",
  color: "#fff",
  minHeight: "100vh", // 화면 전체 높이 적용
  padding: "40px",    // 여백 추가
  display: "grid",
  justifyContent: "center"
};

const summaryNchart = {
  maxWidth: "1900px",
  minWidth: "1000px",
  margin: "0 auto"
}


const monitoringView = () => {
  return (
      <div style={mainColor}>
        <div style={{ textAlign: "left", marginLeft: "10%" }}>
          <p style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "24px" }}>
            수익 모니터링
          </p>
        </div>
        <div style={summaryNchart}>
          <SalesSummaryContainer />
        </div>
      </div>
    );
};

export default monitoringView;

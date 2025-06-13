import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";


const mainColor = {
  background: "#181818",
  color: "#fff",
  minHeight: "100vh", // 화면 전체 높이 적용
  padding: "40px",    // 여백 추가
  // display: "grid",
  // justifyContent: "center"
};

const summaryNchart = {
  maxWidth: "1800px",
  minWidth: "1500px",
  margin: "0 auto"
}


const monitoringView = () => {
  return (
    <div style={mainColor}>
      <div>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "24px" }}>
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

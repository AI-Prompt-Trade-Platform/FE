import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";
import StarryBackground from "../components/mainBackground/StarryBackground"


const mainColor = {
  color: "#fff",
  minHeight: "100vh", // 화면 전체 높이 적용
  padding: "40px",    // 여백 추가
  // display: "grid",
  // justifyContent: "center"
};

const summaryNchart = {
  width: "75%",
  margin: "0 auto"
}


const monitoringView = () => {
  return (
      <div>
        <StarryBackground />
        <div style={summaryNchart}>
          <SalesSummaryContainer />
        </div>
      </div>
    );
};

export default monitoringView;

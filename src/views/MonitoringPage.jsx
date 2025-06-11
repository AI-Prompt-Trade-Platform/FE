import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummary from "../components/MonitoringPage/SalesSummary";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";
// import Carousel from "../component/carousel/recommendCarousel";
// import HomeCalendar from "../component/calendar/homeCalendar";

const container = css`
  position: relative;
  width: 100% - 16px;
  background-color: #ffffff;
  margin: 8px;
  padding: 8px;
  border-radius: 10px;
`;

const calender = css`
  position: relative;
  min-width: 100% - 16px;
  background-color: #ffffff;
  margin: 8px;
  padding: 8px;
  border-radius: 10px;
  // 어떻게 할건지 회의 후 수정----
  height: auto;
  min-height: 450px;
  // -------------------
  items-align: center;
  justify-content: center;
  text-align: center;
  content-align: center;
  display: flex;
`;
const mt8 = css`
  margin-top: 8px;
`;

const task1 = css`
  height: 127px;
`;

const monitoringView = () => {
  const handleDateSelect = (date) => {
    console.log('선택한 날짜:', date); //캘린더에서 선택한 날짜 전달받음 (필요할것 같아서 추가함))
  };

  return (
    <>
      <div>
        <SalesSummaryContainer />
      </div>
    </>
  );
};

export default monitoringView;

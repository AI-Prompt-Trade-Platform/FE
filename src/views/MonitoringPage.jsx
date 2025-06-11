import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummary from "../components/MonitoringPage/SalesSummary";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";



const monitoringView = () => {

  return (
    <>
      <div>
        <SalesSummaryContainer />
      </div>
    </>
  );
};

export default monitoringView;

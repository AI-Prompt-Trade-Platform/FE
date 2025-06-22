import React from "react";
import SalesSummaryContainer from "../../components/MonitoringPage/SummaryContainer";
import StarryBackground from "../../components/Background/StarryBackground";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";
import "./MonitoringPage.css";

const MonitoringPage = () => {
  // const { logout, isAuthenticated } = useAuth0();
  // const navigate = useNavigate();

  return (
    <div className="monitoring-root">
      <StarryBackground />
      {/* 메인 컨텐츠 */}
      <div className="monitoring-content">
        <SalesSummaryContainer />
      </div>
    </div>
  );
};

export default MonitoringPage;

import React from "react";
import SalesSummaryContainer from "../../components/MonitoringPage/SummaryContainer";
import StarryBackground from "../../components/mainBackground/StarryBackground";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./MonitoringPage.css";

const MonitoringPage = () => {
  const { logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="monitoring-root">
      <StarryBackground />
      {/* 네비게이션 바 */}
      <nav className="monitoring-navbar">
        <h1 className="monitoring-navbar-title">Prumpt2.0 모니터링</h1>
        {isAuthenticated && (
          <div className="monitoring-navbar-btns">
            <button
              className="monitoring-btn monitoring-btn-primary"
              onClick={() => navigate("/prompt-register")}
            >
              프롬프트 등록
            </button>
            <button
              className="monitoring-btn"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              로그아웃
            </button>
          </div>
        )}
      </nav>
      {/* 메인 컨텐츠 */}
      <div className="monitoring-content">
        <SalesSummaryContainer />
      </div>
    </div>
  );
};

export default MonitoringPage;

import React from "react";
import { css, Global } from "@emotion/react";
import SalesSummaryContainer from "../components/MonitoringPage/SummaryContainer";
import StarryBackground from "../components/mainBackground/StarryBackground";
import { useAuth0 } from "@auth0/auth0-react";

const mainColor = {
  color: "#fff",
  minHeight: "100vh", // 화면 전체 높이 적용
  padding: "40px",    // 여백 추가
  // display: "grid",
  // justifyContent: "center"
};

const summaryNchart = {
  width: "75%",
  margin: "0 auto",
  position: "relative", // 로그아웃 버튼 위치 지정을 위해 추가
};

const logoutButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "#4a9eff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  padding: "10px 15px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "background-color 0.3s ease",
};

const monitoringView = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
      <div>
        <StarryBackground />
        {/* 상단 네비게이션 바 컴포넌트 */}
        <div style={summaryNchart}>

          {/* 로그아웃 버튼 */}
          {isAuthenticated && (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              style={logoutButtonStyle}
            >
              로그아웃
            </button>
          )}

          <SalesSummaryContainer />
        </div>
      </div>
    );
};

export default monitoringView;

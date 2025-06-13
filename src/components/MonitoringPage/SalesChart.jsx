import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./SalesChart.css"; // CSS 파일 임포트

// period에 따라 기본 차트 데이터 생성
function getDefaultChartData(period) {
  let days = 30;
  if (period === "MONTH") days = 30;
  else if (period === "HALF_YEAR") days = 180;
  else if (period === "YEAR") days = 365;

  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    result.push({
      summaryDate: `${yyyy}-${mm}-${dd}`,
      totalRevenue: 0,
    });
  }
  return result;
}

function SalesChart({ data, period }) {
  // 데이터가 없으면 period에 맞는 기본값 사용
  const chartData = Array.isArray(data) && data.length > 0 ? data : getDefaultChartData(period);

  // X축 날짜 표기 설정: 기간에 따라 간격 조정
  let xAxisTickFormatter = (date) => {
    const [_, mm, dd] = date.split('-');
    return `${mm}/${dd}`;
  };
  let xAxisTicks = undefined;

  if (period === "HALF_YEAR") {
    // 1주일 단위로 tick 생성
    xAxisTickFormatter = (date) => {
      const [_, mm, dd] = date.split('-');
      return `${mm}/${dd}`;
    };
    xAxisTicks = chartData.filter((_, idx) => idx % 7 === 0).map(d => d.summaryDate);
  } else if (period === "YEAR") {
    // 1달 단위로 tick 생성
    xAxisTickFormatter = (date) => {
      const [_, mm] = date.split('-');
      return `${mm}월`;
    };
    xAxisTicks = chartData.filter((d, idx, arr) => {
      // 매월 1일만 tick으로 사용
      return d.summaryDate.endsWith('-01');
    }).map(d => d.summaryDate);
  }

  return (
    <div className="sales-chart-container">
      <div className="sales-chart-title">수익 차트</div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="summaryDate" stroke="#fff" tick={{ fill: "#fff" }}
            tickFormatter={xAxisTickFormatter}
            ticks={xAxisTicks}
          />
          <YAxis stroke="#fff" tick={{ fill: "#fff" }} />
          <Tooltip
            contentStyle={{ background: "#232323", border: "none", color: "#fff" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => value.toLocaleString("ko-KR")}
          />
          <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
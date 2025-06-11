import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function SalesChart({ data }) {
  return (
    <div style={{
      background: "#232323",
      borderRadius: "16px",
      padding: "24px",
      marginTop: "24px",
      width: "100%",
      minHeight: "300px"
    }}>
      <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem", marginBottom: "16px" }}>수익 차트</div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="summaryDate" stroke="#fff" tick={{ fill: "#fff" }} />
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
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PieChartSentiment from "../components/PieChartSentiment";
import LineChartTrend from "../components/LineChartTrend";
import LineChartVolume from "../components/LineChartVolume";
import LiveFeed from "../components/LiveFeed";
import { FaSun, FaMoon } from "react-icons/fa";

export default function BrandDashboard() {
  const { brand } = useParams();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const bgColor = darkMode ? "#1E1E2F" : "#FDF6F0";
  const textColor = darkMode ? "#FFF" : "#1A1A1A";
  const cardStyle = {
    backgroundColor: darkMode ? "#2A2A3E" : "#FFFFFF",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    flex: "1 1 45%",
    margin: "10px",
    minWidth: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", backgroundColor: bgColor, color: textColor, fontFamily: "Times New Roman, Times, serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1>{brand} Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#A8E6CF"
            }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button 
            onClick={() => navigate("/")} 
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#FFB6B9",
              fontSize: "16px"
            }}
          >
            Search For Another Brand
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={cardStyle}><PieChartSentiment brand={brand} darkMode={darkMode} /></div>
        <div style={cardStyle}><LineChartTrend brand={brand} darkMode={darkMode} /></div>
        <div style={cardStyle}><LineChartVolume brand={brand} darkMode={darkMode} /></div>
        <div style={{ ...cardStyle, minHeight: "350px" }}>
          <LiveFeed brand={brand} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

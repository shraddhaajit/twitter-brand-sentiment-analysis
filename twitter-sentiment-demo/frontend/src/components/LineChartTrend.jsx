import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function LineChartTrend({ brand, darkMode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/trend/${brand}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching trend data:", err);
      }
    };
    fetchTrend();
    const interval = setInterval(fetchTrend, 10000);
    return () => clearInterval(interval);
  }, [brand]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center", // center content vertically
        padding: "10px",
      }}
    >
      {/* Title */}
      <h2
        style={{
          marginBottom: "25px",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "600",
          color: darkMode ? "#FFF" : "#1A1A1A",
        }}
      >
        Sentiment Trend
      </h2>

      {/* Chart perfectly centered */}
      <div
        style={{
          width: "95%",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
            <CartesianGrid stroke={darkMode ? "#444" : "#ccc"} />
            <XAxis dataKey="time" stroke={darkMode ? "#FFF" : "#000"} />
            <YAxis stroke={darkMode ? "#FFF" : "#000"} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                borderRadius: "8px",
                color: darkMode ? "#fff" : "#000",
              }}
              itemStyle={{ color: darkMode ? "#fff" : "#000" }}
            />
            <Legend verticalAlign="bottom" height={40} wrapperStyle={{ marginTop: "15px" }} />
            <Line type="monotone" dataKey="Positive" stroke="#A8E6CF" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Neutral" stroke="#FFF3B0" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Negative" stroke="#FF8B94" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

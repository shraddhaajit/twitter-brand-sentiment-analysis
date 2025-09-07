import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#A8E6CF", "#FFF3B0", "#FF8B94"];

export default function PieChartSentiment({ brand, darkMode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/sentiment/${brand}`);
        const json = await res.json();
        setData([
          { name: "Positive", value: json.Positive },
          { name: "Neutral", value: json.Neutral },
          { name: "Negative", value: json.Negative },
        ]);
      } catch (err) {
        console.error("Error fetching sentiment data:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
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
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "72px",
          textAlign: "center",
          color: darkMode ? "#FFF" : "#1A1A1A",
        }}
      >
        Sentiment Distribution
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <ResponsiveContainer width="70%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="40%" // centers pie more to the left
              cy="38%"
              outerRadius={115}
              labelLine={false}
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                borderRadius: "8px",
                color: darkMode ? "#fff" : "#000",
              }}
              itemStyle={{
                color: darkMode ? "#fff" : "#000",
              }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                paddingLeft: "30px", // pushes legend away from pie
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function LineChartVolume({ brand, darkMode }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://127.0.0.1:5000/api/trend/${brand}`);
      const json = await res.json();

      const volumeData = json.map((d) => ({
        time: d.time,
        volume: (d.Positive || 0) + (d.Neutral || 0) + (d.Negative || 0),
      }));

      setData(volumeData);
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [brand]);

  return (
    <div style={{ width: "100%", height: 480 }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "35px",
          fontSize: "1.5rem", // unified font size for all chart titles
          color: darkMode ? "#FFF" : "#1A1A1A",
        }}
      >
        Tweet Volume
      </h2>
      <ResponsiveContainer width="100%" height="75%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid stroke={darkMode ? "#444" : "#ccc"} />
          <XAxis dataKey="time" stroke={darkMode ? "#FFF" : "#000"} />
          <YAxis stroke={darkMode ? "#FFF" : "#000"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#333" : "#fff",
              borderRadius: "8px",
              color: darkMode ? "#fff" : "#000",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="volume" stroke="#79C7E3" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

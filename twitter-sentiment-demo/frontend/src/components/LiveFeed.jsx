import React, { useEffect, useState } from "react";

const sentimentColors = {
  positive: "#A8E6CF",
  neutral: "#FFF3B0",
  negative: "#FF8B94"
};

const sentimentShadows = {
  positive: "0 0 8px rgba(168, 230, 207, 0.6)",
  neutral: "0 0 8px rgba(255, 243, 176, 0.6)",
  negative: "0 0 8px rgba(255, 139, 148, 0.6)"
};

export default function LiveFeed({ brand, darkMode }) {
  const [tweets, setTweets] = useState([]);

  const fetchTweets = async () => {
    const res = await fetch(`http://127.0.0.1:5000/api/tweets/${brand}`);
    const data = await res.json();

    // take only first 5 tweets and normalize sentiment
    const normalized = data.slice(0, 5).map(tweet => {
      const sentiment = (tweet.sentiment || "").toLowerCase();
      if (sentiment.includes("positive")) return { ...tweet, sentiment: "positive" };
      if (sentiment.includes("neutral")) return { ...tweet, sentiment: "neutral" };
      return { ...tweet, sentiment: "negative" };
    });

    setTweets(normalized);
  };

  useEffect(() => {
    fetchTweets();
    const interval = setInterval(fetchTweets, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [brand]);

  const cardBg = darkMode ? "#2A2A3E" : "#FFFFFF"; // match other charts

  return (
    <div style={{
      padding: "12px",
      borderRadius: "12px",
      backgroundColor: cardBg,
      minHeight: "500px",
      maxHeight: "100px",         // fit content
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box"
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "40px",
        fontSize: "1.5rem",
        color: darkMode ? "#FFF" : "#1A1A1A"
      }}>Live Feed</h2>

      {tweets.map((t, idx) => (
        <div key={idx} style={{
          backgroundColor: cardBg,
          color: darkMode ? "#FFF" : "#1A1A1A",
          padding: "15px",
          margin: "8px 0",
          borderRadius: "12px",
          width: "95%",
          boxShadow: sentimentShadows[t.sentiment] || "0 0 8px rgba(0,0,0,0.2)",
          transition: "all 0.2s ease",
          wordWrap: "break-word"
        }}>
          {t.content}
        </div>
      ))}
    </div>
  );
}

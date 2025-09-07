import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (brand.trim() !== "") navigate(`/dashboard/${brand}`);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#FFF0F5",
      width: "100vw"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1>Twitter Sentiment Dashboard</h1>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={brand}
            placeholder="Enter brand"
            onChange={(e) => setBrand(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "10px",
              fontSize: "16px"
            }}
          />
          <button type="submit" style={{
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#FFB6B9",
            cursor: "pointer",
            fontSize: "16px"
          }}>Submit</button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import BrandDashboard from "./pages/BrandDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/dashboard/:brand" element={<BrandDashboard />} />
      </Routes>
    </Router>
  );
}

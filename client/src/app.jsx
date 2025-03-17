import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InputForm from "./pages/InputForm";
import ResultPage from "./pages/ResultPage"; // Страница с результатами

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<InputForm />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

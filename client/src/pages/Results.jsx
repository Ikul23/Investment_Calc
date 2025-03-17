import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

function Results() {
  return (
    <div>
      <h1>Результаты расчета</h1>
      <p>Здесь будут NPV, IRR, DPBP...</p>
      <Link to="/">На главную</Link>
    </div>
  );
}

export default Results;

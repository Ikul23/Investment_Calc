import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../index.css";

const data = [
  { year: 2025, npv: -30000 },
  { year: 2026, npv: -50000 },
  { year: 2027, npv: 10000 },
  { year: 2028, npv: 50000 },
  { year: 2029, npv: 150000 },
];

const ResultPage = () => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3 className="text-center text-primary">График NPV</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="npv" stroke="#007bff" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultPage;
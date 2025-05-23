'use client';

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Gradient palette
const PALETTE = [
  { light: "#15AFE4", dark: "#0D7AAB" },
  { light: "#FFC107", dark: "#B38600" },
  { light: "#23DD1D", dark: "#149A11" },
  { light: "#38CCD4", dark: "#1F7F84" },
  { light: "#A17CFF", dark: "#5E3DBD" },
  { light: "#FF8A65", dark: "#C75B39" },
  { light: "#85FF8C", dark: "#50AA5B" },
  { light: "#FF92E3", dark: "#C25AA8" },
  { light: "#FFA600", dark: "#C67800" },
  { light: "#7A5195", dark: "#50275F" },
  { light: "#bcb8b8", dark: "#807c7c" },
];

const getColor = (i) => PALETTE[i % PALETTE.length].light;
const getDark = (i) => PALETTE[i % PALETTE.length].dark;

const companyData = [
{ name: "MARUTI SUZUKI INDIA LTD", Apr25: 38.26, Mar25: 36.68, Apr24: 39.42 },
  { name: "MAHINDRA & MAHINDRA LIMITED", Apr25: 13.42, Mar25: 12.81, Apr24: 10.96 },
  { name: "TATA MOTORS LTD", Apr25: 12.22, Mar25: 13.41, Apr24: 13.29 },
  { name: "HYUNDAI MOTOR INDIA LTD", Apr25: 12.11, Mar25: 11.77, Apr24: 13.98 },
  { name: "TOYOTA KIRLOSKAR MOTOR PVT LTD", Apr25: 6.48, Mar25: 6.46, Apr24: 5.72 },
  { name: "KIA INDIA PRIVATE LIMITED", Apr25: 6.00, Mar25: 6.09, Apr24: 5.62 },
  { name: "SKODA AUTO VOLKSWAGEN GROUP", Apr25: 2.62, Mar25: 2.51, Apr24: 1.92 },
  { name: "SKODA AUTO VOLKSWAGEN INDIA PVT LTD", Apr25: 2.62, Mar25: 2.50, Apr24: 1.91 },
  { name: "VOLKSWAGEN AG/INDIA PVT. LTD.", Apr25: 0.00, Mar25: 0.01, Apr24: 0.00 },
  { name: "AUDI AG", Apr25: 0.01, Mar25: 0.01, Apr24: 0.01 },
  { name: "SKODA AUTO INDIA/AS PVT LTD", Apr25: 0.00, Mar25: 0.00, Apr24: 0.00 },
  { name: "MG MOTOR INDIA PVT LTD", Apr25: 1.35, Mar25: 1.43, Apr24: 1.21 },
  { name: "HONDA CARS INDIA LTD", Apr25: 1.34, Mar25: 1.36, Apr24: 1.77 },
  { name: "RENAULT INDIA PVT LTD", Apr25: 0.79, Mar25: 0.73, Apr24: 1.15 },
  { name: "NISSAN MOTOR INDIA PVT LTD", Apr25: 0.51, Mar25: 0.49, Apr24: 0.64 },
  { name: "MERCEDES -BENZ GROUP", Apr25: 0.37, Mar25: 0.43, Apr24: 0.46 },
  { name: "MERCEDES-BENZ INDIA PVT LTD", Apr25: 0.34, Mar25: 0.39, Apr24: 0.41 },
  { name: "MERCEDES -BENZ AG", Apr25: 0.02, Mar25: 0.04, Apr24: 0.05 },
  { name: "DAIMLER AG", Apr25: 0.01, Mar25: 0.00, Apr24: 0.00 },
  { name: "BMW INDIA PVT LTD", Apr25: 0.34, Mar25: 0.35, Apr24: 0.36 },
  { name: "FORCE MOTORS LIMITED", Apr25: 0.23, Mar25: 0.24, Apr24: 0.22 },
  { name: "JAGUAR LAND ROVER INDIA LIMITED", Apr25: 0.11, Mar25: 0.14, Apr24: 0.09 },
  { name: "PCA AUTOMOBILES INDIA PVT LTD", Apr25: 0.11, Mar25: 0.09, Apr24: 0.15 },
  { name: "BYD INDIA PRIVATE LIMITED", Apr25: 0.10, Mar25: 0.11, Apr24: 0.04 },
  { name: "FCA INDIA AUTOMOBILES PRIVATE LIMITED", Apr25: 0.08, Mar25: 0.08, Apr24: 0.11 },
  { name: "VOLVO AUTO INDIA PVT LTD", Apr25: 0.03, Mar25: 0.04, Apr24: 0.04 },
  { name: "Others", Apr25: 0.59, Mar25: 1.86, Apr24: 0.51 },
].filter(c => c.Apr25 !== 0 || c.Mar25 !== 0 || c.Apr24 !== 0);

const getComparisonData = (currentKey, compareKey, showSymbol) =>
  companyData.map((item) => {
    const symbol =
      showSymbol && item[currentKey] > item[compareKey] ? "▲" :
      showSymbol && item[currentKey] < item[compareKey] ? "▼" : "";
    return {
      name: item.name,
      value: item[currentKey],
      symbol,
    };
  });

const companyNames = companyData.map(item => item.name);

const ChartWithComparison = ({ current, compare, title }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, symbol } = payload[0].payload;
    return (
      <div style={{ background: '#222', color: '#fff', padding: 8, borderRadius: 4, fontSize: 10 }}>
        <strong>{name}</strong><br />
        Value: {value.toFixed(2)}% {symbol}
      </div>
    );
  };

  return (
    <div className="col-lg-6 col-12 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 260 : 600 }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {data.map((_, i) => (
                <linearGradient key={i} id={`sliceGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getColor(i)} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={getDark(i)} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 50 : 130}
              outerRadius={isMobile ? 90 : 200}
              paddingAngle={3}
              stroke="rgba(255,255,255,0.1)"
              labelLine={false}
              label={({ name, value }) => {
                const item = data.find(d => d.name === name);
                return `${item?.symbol || ''} ${value.toFixed(1)}%`;
              }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#sliceGrad-${i})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PassengerPieChart = () => {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: "#ffdc00" }}>Passenger Vehicle OEM Share Comparison</h5>
        </div>
      </div>

      <div className="row">
        <ChartWithComparison current="Mar25" compare="Apr24" title="MoM - Mar 25" />
        <ChartWithComparison current="Apr25" compare="Mar25" title="MoM - Apr 25" />
        <ChartWithComparison current="Apr24" compare="Apr25" title="YoY - Apr 24" />
        <ChartWithComparison current="Apr25" compare="Apr24" title="YoY - Apr 25" />
      </div>

      {/* Shared Legend */}
      <div className="mt-4 text-center">
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {companyNames.map((name, i) => (
            <div key={name} className="d-flex align-items-center">
              <div
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: getColor(i),
                  marginRight: 6,
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontSize: 12 }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerPieChart;

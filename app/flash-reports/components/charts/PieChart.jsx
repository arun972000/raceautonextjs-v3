'use client';

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMediaQuery } from "react-responsive";

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
  { name: "HERO MOTOCORP LTD", Apr25: 30.34, Mar25: 28.9, Apr24: 31.06 },
  { name: "HONDA MOTORCYCLE AND SCOOTER INDIA", Apr25: 24.08, Mar25: 23.61, Apr24: 23.97 },
  { name: "TVS MOTOR COMPANY LTD", Apr25: 18.34, Mar25: 18.24, Apr24: 17.04 },
  { name: "BAJAJ AUTO GROUP", Apr25: 10.85, Mar25: 11.35, Apr24: 11.9 },
  { name: "SUZUKI MOTORCYCLE INDIA PVT LTD", Apr25: 5.44, Mar25: 5.58, Apr24: 4.75 },
  { name: "ROYAL-ENFIELD (UNIT OF EICHER LTD)", Apr25: 4.75, Mar25: 5, Apr24: 4.46 },
  { name: "INDIA YAMAHA MOTOR PVT LTD", Apr25: 3.1, Mar25: 3.19, Apr24: 3.4 },
  { name: "OLA ELECTRIC TECHNOLOGIES PVT LTD", Apr25: 1.17, Mar25: 1.55, Apr24: 2.07 },
  { name: "ATHER ENERGY PVT LTD", Apr25: 0.78, Mar25: 1.03, Apr24: 0.25 },
  { name: "Others Including EV", Apr25: 1.16, Mar25: 1.56, Apr24: 1.09 },
];

const companyNames = companyData.map(item => item.name);

const getComparisonData = (currentKey, compareKey, showSymbol) =>
  companyData.map((item) => {
    const symbol =
      showSymbol && item[currentKey] > item[compareKey] ? "▲"
        : showSymbol && item[currentKey] < item[compareKey] ? "▼"
          : "";
    return {
      name: item.name,
      value: item[currentKey],
      symbol,
    };
  });

const ChartWithComparison = ({ current, compare, title }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });
  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, symbol } = payload[0].payload;
    return (
      <div style={{
        background: '#222', color: '#fff',
        padding: 8, borderRadius: 4, fontSize: 12
      }}>
        <strong>{name}</strong><br />
        Value: {value.toFixed(2)}% {symbol}
      </div>
    );
  };

  return (
    <div className="col-md-6 col-12 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 260 : 300 }}>
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
              innerRadius={isMobile ? 50 : 85}
              outerRadius={isMobile ? 90 : 120}
              paddingAngle={4}
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

const TwoWheelerPieChart = () => {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: "#ffdc00" }}>2-Wheeler Overall OEM Share Comparison</h5>
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
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoWheelerPieChart;

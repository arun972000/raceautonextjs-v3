'use client'

import React from "react";
import { useMediaQuery } from 'react-responsive';
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
  { name: "BAJAJ AUTO LTD", Apr25: 30.78, Mar25: 31.7, Apr24: 35.66 },
  { name: "PIAGGIO VEHICLES PVT LTD", Apr25: 5.99, Mar25: 6.62, Apr24: 7.02 },
  { name: "MAHINDRA & MAHINDRA LIMITED", Apr25: 5.92, Mar25: 6.9, Apr24: 4.54 },
  { name: "MAHINDRA LAST MILE MOBILITY LTD", Apr25: 5.9, Mar25: 6.87, Apr24: 4.33 },
  { name: "MAHINDRA & MAHINDRA LIMITED (2)", Apr25: 0.02, Mar25: 0.03, Apr24: 0.2 },
  { name: "YC ELECTRIC VEHICLE", Apr25: 3.17, Mar25: 3.23, Apr24: 3.5 },
  { name: "TVS MOTOR COMPANY LTD", Apr25: 2.97, Mar25: 2.77, Apr24: 1.89 },
  { name: "ATUL AUTO LTD", Apr25: 1.9, Mar25: 2.29, Apr24: 2.1 },
  { name: "SAERA ELECTRIC AUTO PVT LTD", Apr25: 1.69, Mar25: 2.09, Apr24: 2.34 },
  { name: "DILLI ELECTRIC AUTO PVT LTD", Apr25: 1.66, Mar25: 1.62, Apr24: 1.92 },
  { name: "J. S. AUTO (P) LTD", Apr25: 1.14, Mar25: 1.04, Apr24: 0.94 },
  { name: "ENERGY ELECTRIC VEHICLES", Apr25: 1.11, Mar25: 1.02, Apr24: 1.14 },
  { name: "SAHNIANAND E VEHICLES PVT LTD", Apr25: 1.03, Mar25: 1.09, Apr24: 0.71 },
  { name: "MINI METRO EV L.L.P", Apr25: 0.98, Mar25: 0.95, Apr24: 1.15 },
  { name: "Others including EV", Apr25: 35.74, Mar25: 31.78, Apr24: 32.55 },
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
  // Use react-responsive hook for mobile detection
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });

  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, symbol } = payload[0].payload;
    return (
      <div style={{
        background: '#222',
        color: '#fff',
        padding: 8,
        borderRadius: 4,
        fontSize: 10,
      }}>
        <strong>{name}</strong><br />
        Value: {value.toFixed(2)}% {symbol}
      </div>
    );
  };

  return (
    <div className="col-lg-6 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 250 : 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {data.map((_, i) => (
                <linearGradient
                  key={i}
                  id={`sliceGrad-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
              innerRadius={isMobile ? 30 : 120}
              outerRadius={isMobile ? 90 : 190}
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

const ThreeWheeler_PieChart = () => {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: "#ffdc00" }}>3-Wheeler OverAll OEM Share Comparison</h5>
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

export default ThreeWheeler_PieChart;

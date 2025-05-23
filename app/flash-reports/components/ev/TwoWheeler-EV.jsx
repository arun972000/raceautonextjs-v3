'use client'

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Gradient color palette
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
  { name: "TVS Motor", Apr24: 13.26, Mar25: 24.60, Apr25: 22.78 },
  { name: "Ola Electric", Apr24: 58.39, Mar25: 18.88, Apr25: 22.74 },
  { name: "Bajaj Auto/Chetak", Apr24: 12.92, Mar25: 28.18, Apr25: 21.94 },
  { name: "Ather Energy", Apr24: 7.08, Mar25: 12.52, Apr25: 15.20 },
  { name: "Hero Motocorp", Apr24: 1.63, Mar25: 6.44, Apr25: 7.07 },
  { name: "Ampere/Greaves", Apr24: 4.57, Mar25: 4.54, Apr25: 4.64 },
  { name: "Pur Energy", Apr24: 0.64, Mar25: 1.45, Apr25: 1.67 },
  { name: "BGauss Auto", Apr24: 1.22, Mar25: 2.08, Apr25: 1.51 },
  { name: "Kinetic Green", Apr24: 0.76, Mar25: 0.68, Apr25: 1.51 },
  { name: "River Mobility", Apr24: 0.42, Mar25: 0.64, Apr25: 0.91 },
  { name: "Others", Apr24: 11.47, Mar25: 5.61, Apr25: 5.61 },
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
  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  // Responsive sizes
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set sizes conditionally based on breakpoint (example: 768px)
  const isMobile = windowWidth < 768;
  const chartHeight = isMobile ? 220 : 400;
  const innerRadius = isMobile ? 60 : 85;
  const outerRadius = isMobile ? 90 : 120;

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
    <div className="col-md-6 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: chartHeight }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {data.map((_, i) => (
                <linearGradient
                  key={i}
                  id={`evGrad-${i}`}
                  x1="0" y1="0" x2="0" y2="1"
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
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={4}
              stroke="rgba(255,255,255,0.1)"
              labelLine={false}
              label={({ name, value }) => {
                const item = data.find(d => d.name === name);
                return `${item?.symbol || ''} ${value.toFixed(1)}%`;
              }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#evGrad-${i})`} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TwoWheelerEV = () => {
  return (
    <div className="container px-3 px-md-5">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: '#59bea0' }}>2-Wheeler EV Electric Share Comparison</h5>
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

export default TwoWheelerEV;

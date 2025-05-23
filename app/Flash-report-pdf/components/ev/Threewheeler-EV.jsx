'use client'

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Gradient palette
const PALETTE = [
  { light: "#003f5c", dark: "#001c2e" },
  { light: "#2f4b7c", dark: "#1b2949" },
  { light: "#665191", dark: "#3b3660" },
  { light: "#a05195", dark: "#643064" },
  { light: "#d45087", dark: "#8c2e59" },
  { light: "#f95d6a", dark: "#9e3139" },
  { light: "#ff7c43", dark: "#b24c1c" },
  { light: "#ffa600", dark: "#c76c00" },
];

const getColor = (i) => PALETTE[i % PALETTE.length].light;
const getDark = (i) => PALETTE[i % PALETTE.length].dark;

const companyData = [
  { name: "Bajaj Auto", Apr24: 31.32, Apr25: 41.11, Mar25: 36.98 },
  { name: "Mahindra Last Mile", Apr24: 46.68, Apr25: 36.12, Mar25: 41.46 },
  { name: "TVS Motor Company", Apr24: 0.94, Apr25: 9.65, Mar25: 5.73 },
  { name: "Piaggio Vehicles", Apr24: 14.18, Apr25: 8.03, Mar25: 9.52 },
  { name: "TI Clean Mobility", Apr24: 5.08, Apr25: 3.99, Mar25: 4.18 },
  { name: "Omega Seiki", Apr24: 1.81, Apr25: 1.14, Mar25: 2.16 },
  { name: "Others", Apr24: 10.91, Apr25: -1.35, Mar25: 5.01 },
];


const companyNames = companyData.map(item => item.name);

const getComparisonData = (currentKey, compareKey, showSymbol) =>
  companyData
    .filter(item => item[currentKey] && item[currentKey] > 0)
    .map((item) => {
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
    <div className="col-12 col-md-6 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: 300, minWidth: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {data.map((_, i) => (
                <linearGradient
                  key={i}
                  id={`sliceGrad-${i}`}
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
              innerRadius={70}
              outerRadius={100}
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

const ThreeWheelerEV = () => {
  return (
    <div className="container px-3 px-md-5">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: '#59bea0' }}>3-Wheeler EV Electric Share Comparison</h5>
        </div>
      </div>

      <div className="row justify-content-center">
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
              <span style={{ fontSize: '0.9rem', minWidth: 80, textAlign: 'left' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeWheelerEV;

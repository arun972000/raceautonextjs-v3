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
  { light: "#15AFE4", dark: "#0D7AAB" },   // Bright cyan-blue
  { light: "#FFC107", dark: "#B38600" },   // Vivid amber
  { light: "#23DD1D", dark: "#149A11" },   // Pure green
  { light: "#A17CFF", dark: "#5E3DBD" },   // Soft purple
  { light: "#FF8A65", dark: "#C75B39" },   // Coral
  { light: "#607D8B", dark: "#37474F" },   // Slate blue-gray
  { light: "#FFD166", dark: "#C79B26" },   // Yellow-orange
  { light: "#EF476F", dark: "#A2304A" },   // Crimson red
  { light: "#06D6A0", dark: "#04936F" },   // Teal-green
  { light: "#073B4C", dark: "#041E25" },   // Navy-black
  { light: "#F4A261", dark: "#B87434" },   // Desert tan
  { light: "#9B5DE5", dark: "#6630A6" },   // Violet
  { light: "#FEE440", dark: "#C6B000" },   // Bold yellow
  { light: "#00F5D4", dark: "#00A88F" },   // Bright aqua
  { light: "#C0CA33", dark: "#8A9A16" },   // Yellow-lime
  { light: "#FF7043", dark: "#BF360C" },   // Rich orange
  { light: "#8D6E63", dark: "#5D4037" },   // Mocha brown
  { light: "#FF6F00", dark: "#C45000" },   // Deep orange
  { light: "#1E88E5", dark: "#125EA9" },   // Primary blue
  { light: "#43A047", dark: "#2B702F" },   // Forest green
  { light: "#D81B60", dark: "#991042" },   // Rose red
  { light: "#F4511E", dark: "#B2360F" },   // Rust
  { light: "#3949AB", dark: "#27317C" },   // Indigo
  { light: "#00897B", dark: "#005F56" },   // Dark teal
  { light: "#90A4AE", dark: "#607D8B" },   // Muted steel
  { light: "#B0EB00", dark: "#7DA300" },   // Neon lime
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
    const currentValue = item[currentKey];
    const compareValue = item[compareKey];
    let symbol = "";
    let increased = false;
    let decreased = false;

    if (showSymbol) {
      if (currentValue > compareValue) {
        symbol = "▲";
        increased = true;
      } else if (currentValue < compareValue) {
        symbol = "▼";
        decreased = true;
      }
    }

    return {
      name: item.name,
      value: currentValue,
      symbol,
      increased,
      decreased,
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

  // Custom label renderer to show values outside with colored arrows
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // Push label outside slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

    let arrowColor = "#fff";
    if (item.increased) arrowColor = "green";
    else if (item.decreased) arrowColor = "red";

    const labelColor = "#ccc";

    return (
      <text
        x={x}
        y={y}
        fill={labelColor}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        <tspan fill={arrowColor}>{item.symbol} </tspan>
        <tspan>{value.toFixed(1)}%</tspan>
      </text>
    );
  };

  return (
    <div className="col-lg-6 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 250 : 500 }}>
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
              innerRadius={isMobile ? 60 : 140}
              outerRadius={isMobile ? 90 : 190}
              paddingAngle={4}
              stroke="rgba(255,255,255,0.1)"
              labelLine={false}
              label={renderCustomLabel}
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
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col text-center">
          <h4 style={{ color: "#ffdc00" }}>3-Wheeler OverAll OEM Market Share Comparison</h4>
        </div>
      </div>

   <div className="row">
  <ChartWithComparison current="Mar25" compare="Apr24" title="Month on Month (MoM) - Mar 25" />
  <ChartWithComparison current="Apr25" compare="Mar25" title="Month on Month (MoM) - Apr 25" />
  <ChartWithComparison current="Apr24" compare="Apr25" title="Year on Year (YoY) - Apr 24" />
  <ChartWithComparison current="Apr25" compare="Apr24" title="Year on Year (YoY) - Apr 25" />
</div>

      {/* Shared Legend */}
      <div className="mt-3">
        <div
          className="d-flex flex-wrap justify-content-center gap-2"
          style={{ fontSize: '9px', lineHeight: '1.2' }}
        >
          {companyNames.map((name, i) => (
            <div
              key={name}
              className="d-flex align-items-center"
              style={{ margin: '4px 6px', maxWidth: '45%' }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: getColor(i),
                  marginRight: 4,
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeWheeler_PieChart;

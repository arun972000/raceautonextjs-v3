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
    let symbol = "";
    if (showSymbol) {
      if (item[currentKey] > item[compareKey]) symbol = "▲";
      else if (item[currentKey] < item[compareKey]) symbol = "▼";
    }
    return {
      name: item.name,
      value: item[currentKey],
      symbol,
      increased: item[currentKey] > item[compareKey],
      decreased: item[currentKey] < item[compareKey],
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

  // Custom label for pie slices with colored arrows
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;  // position outside
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

    let arrowColor = "white";
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

const TwoWheelerPieChart = () => {
  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col text-center">
          <h4 style={{ color: "#ffdc00" }}>2-Wheeler Overall OEM Market Share Comparison</h4>
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

export default TwoWheelerPieChart;

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
  { light: "#15AFE4", dark: "#0D7AAB" },   // Bright blue
  { light: "#FFC107", dark: "#B38600" },   // Amber
  { light: "#23DD1D", dark: "#149A11" },   // Vivid green
  { light: "#38CCD4", dark: "#1F7F84" },   // Aqua/cyan
  { light: "#A17CFF", dark: "#5E3DBD" },   // Purple
  { light: "#FF8A65", dark: "#C75B39" },   // Coral
  { light: "#85FF8C", dark: "#50AA5B" },   // Mint green
  { light: "#FF92E3", dark: "#C25AA8" },   // Pink
  { light: "#FFA600", dark: "#C67800" },   // Orange
  { light: "#7A5195", dark: "#50275F" },   // Deep purple
  { light: "#bcb8b8", dark: "#807c7c" },   // Neutral gray
  { light: "#FF6F91", dark: "#C74361" },   // Rose pink
  { light: "#6A4C93", dark: "#3F2A5A" },   // Muted violet
  { light: "#FFD166", dark: "#C79B26" },   // Yellow-orange
  { light: "#EF476F", dark: "#A2304A" },   // Crimson
  { light: "#06D6A0", dark: "#04936F" },   // Green-teal
  { light: "#073B4C", dark: "#041E25" },   // Navy-black
  { light: "#F4A261", dark: "#B87434" },   // Tan-orange
  { light: "#E76F51", dark: "#A24530" },   // Burnt sienna
  { light: "#9B5DE5", dark: "#6630A6" },   // Electric purple
  { light: "#F15BB5", dark: "#A73779" },   // Fuchsia
  { light: "#FEE440", dark: "#C6B000" },   // Bright yellow
  { light: "#00F5D4", dark: "#00A88F" },   // Aqua-mint
  { light: "#C0CA33", dark: "#8A9A16" },   // Lime olive
  { light: "#FF7043", dark: "#BF360C" },   // Deep orange
  { light: "#8D6E63", dark: "#5D4037" },   // Mocha brown
];

const getColor = (i) => PALETTE[i % PALETTE.length].light;
const getDark = (i) => PALETTE[i % PALETTE.length].dark;

const companyData = [
  { name: 'TATA MOTORS LTD', Apr25: 33.56, Mar25: 31.17, Apr24: 33.24 },
  { name: 'MAHINDRA & MAHINDRA LIMITED', Apr25: 23.24, Mar25: 24.72, Apr24: 21.21 },
  { name: 'ASHOK LEYLAND LTD', Apr25: 17.41, Mar25: 16.74, Apr24: 17.06 },
  { name: 'VE COMMERCIAL VEHICLES LTD', Apr25: 8.35, Mar25: 6.93, Apr24: 7.10 },
  { name: 'FORCE MOTORS LIMITED', Apr25: 3.66, Mar25: 2.75, Apr24: 1.90 },
  { name: 'MARUTI SUZUKI INDIA LTD', Apr25: 3.53, Mar25: 4.02, Apr24: 3.50 },
  { name: 'DAIMLER INDIA COMMERCIAL VEHICLES PVT. LTD', Apr25: 2.19, Mar25: 1.89, Apr24: 2.04 },
  { name: 'SML ISUZU LTD', Apr25: 1.32, Mar25: 1.05, Apr24: 1.13 },
  { name: 'Others', Apr25: 6.72, Mar25: 7.65, Apr24: 6.64 },
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

  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

    let arrowColor = "white";
    if (item.increased) arrowColor = "green";
    else if (item.decreased) arrowColor = "red";

    return (
      <text
        x={x}
        y={y}
        fill="#ccc"
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
                <linearGradient key={i} id={`cvGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
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
                <Cell key={i} fill={`url(#cvGrad-${i})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CVPieChart = () => {
  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col text-center">
          <h4 style={{ color: "#ffdc00" }}>CV Overall OEM Market Share Comparison</h4>
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
        <div className="d-flex flex-wrap justify-content-center gap-2" style={{ fontSize: '9px', lineHeight: '1.2' }}>
          {companyNames.map((name, i) => (
            <div key={name} className="d-flex align-items-center" style={{ margin: '4px 6px', maxWidth: '45%' }}>
              <div style={{
                width: 10,
                height: 10,
                backgroundColor: getColor(i),
                marginRight: 4,
                borderRadius: "50%",
                flexShrink: 0,
              }} />
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

export default CVPieChart;

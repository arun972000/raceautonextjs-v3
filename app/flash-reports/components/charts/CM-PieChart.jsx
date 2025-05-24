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

// Arrow components with colors
const ArrowUp = () => (
  <tspan fill="green" fontWeight="bold" fontSize={14} style={{ userSelect: 'none' }}>
    ▲{" "}
  </tspan>
);
const ArrowDown = () => (
  <tspan fill="red" fontWeight="bold" fontSize={14} style={{ userSelect: 'none' }}>
    ▼{" "}
  </tspan>
);

const ChartWithComparison = ({ current, compare, title }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 576px)' });
  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  // Tooltip with colored arrows
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, increased, decreased } = payload[0].payload;
    return (
      <div style={{
        background: '#222',
        color: '#fff',
        padding: 8,
        borderRadius: 4,
        fontSize: 12,
        minWidth: 120,
      }}>
        <strong>{name}</strong><br />
        Value: {value.toFixed(2)}%{" "}
        {increased && <span style={{ color: 'green', fontWeight: 'bold' }}>▲</span>}
        {decreased && <span style={{ color: 'red', fontWeight: 'bold' }}>▼</span>}
      </div>
    );
  };

  // Custom label for pie slices with colored arrows
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;  // position label outside the slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

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
        {item.increased && <ArrowUp />}
        {item.decreased && <ArrowDown />}
        <tspan>{value.toFixed(1)}%</tspan>
      </text>
    );
  };

  return (
    <div className="col-md-6 col-12 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 240 : 300 }}>
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
              innerRadius={isMobile ? 45 : 85}
              outerRadius={isMobile ? 70 : 120}
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

const CM_PieChart = () => {
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: "#ffdc00" }}>
            Commercial Vehicle Overall OEM Share Comparison
          </h5>
        </div>
      </div>

      <div className="row">
        <ChartWithComparison current="Mar25" compare="Apr24" title="MoM - Mar 25" />
        <ChartWithComparison current="Apr25" compare="Mar25" title="MoM - Apr 25" />
        <ChartWithComparison current="Apr24" compare="Apr25" title="YoY - Apr 24" />
        <ChartWithComparison current="Apr25" compare="Apr24" title="YoY - Apr 25" />
      </div>

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

export default CM_PieChart;

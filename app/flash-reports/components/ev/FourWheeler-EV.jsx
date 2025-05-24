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
  { name: "TATA MOTORS", Apr25: 36.25, Mar25: 37.58 },
  { name: "MG MOTOR", Apr25: 28.27, Mar25: 31.63 },
  { name: "MAHINDRA & MAHINDRA", Apr25: 24.40, Mar25: 16.07 },
  { name: "HYUNDAI MOTOR", Apr25: 5.54, Mar25: 6.82 },
  { name: "BYD INDIA", Apr25: 2.82, Mar25: 3.33 },
  { name: "BMW INDIA", Apr25: 1.03, Mar25: 2.05 },
  { name: "PCA AUTOMOBILES", Apr25: 0.39, Mar25: 0.36 },
  { name: "MERCEDES-BENZ INDIA", Apr25: 0.66, Mar25: 1.41 },
  { name: "VOLVO AUTO INDIA", Apr25: 0.29, Mar25: 0.38 },
  { name: "KIA INDIA", Apr25: 0.25, Mar25: 0.19 },
  { name: "OTHERS", Apr25: 0.08, Mar25: 0.17 },
];

const companyNames = companyData.map(item => item.name);

const getComparisonData = (currentKey, compareKey, showSymbol) =>
  companyData
    .filter(item => item[currentKey] && item[currentKey] > 0)
    .map((item) => {
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
  const isMobile = useMediaQuery({ query: "(max-width: 576px)" });
  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, symbol } = payload[0].payload;
    const arrowColor = symbol === "▲" ? "green" : symbol === "▼" ? "red" : "#ccc";
    return (
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: 8,
          borderRadius: 4,
          fontSize: 12,
        }}
      >
        <strong>{name}</strong>
        <br />
        Value: {value.toFixed(2)}%{" "}
        <span style={{ color: arrowColor, fontWeight: "bold" }}>{symbol}</span>
      </div>
    );
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // place label outside pie slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

    let arrowColor = "#ccc";
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
    <div className="col-12 col-md-6 mb-4">
      <h6 className="text-center fw-semibold mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 260 : 300, minWidth: 280 }}>
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
              innerRadius={isMobile ? 50 : 70}
              outerRadius={isMobile ? 90 : 100}
              paddingAngle={4}
              stroke="rgba(255,255,255,0.1)"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#sliceGrad-${i})`} style={{ outline: "none" }} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const FoureWheelerEV = () => {
  return (
    <div className="container px-3 px-md-5">
      <div className="row mb-4">
        <div className="col text-center">
          <h5 style={{ color: "#59bea0" }}>
            Passenger Vehicle EV Electric Share Comparison
          </h5>
        </div>
      </div>

      <div className="row justify-content-center">
        <ChartWithComparison current="Mar25" compare="Apr24" title="MoM - Mar 25" />
        <ChartWithComparison current="Apr25" compare="Mar25" title="MoM - Apr 25" />
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
              <span style={{ fontSize: "0.9rem", minWidth: 80, textAlign: "left" }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoureWheelerEV;

'use client';

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Color Palette ---
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

// --- Data ---
const companyData = [
  { name: "MARUTI SUZUKI INDIA LTD", Apr25: 38.26, Mar25: 36.68, Apr24: 39.42 },
  { name: "MAHINDRA & MAHINDRA LIMITED", Apr25: 13.42, Mar25: 12.81, Apr24: 10.96 },
  { name: "TATA MOTORS LTD", Apr25: 12.22, Mar25: 13.41, Apr24: 13.29 },
  { name: "HYUNDAI MOTOR INDIA LTD", Apr25: 12.11, Mar25: 11.77, Apr24: 13.98 },
  { name: "TOYOTA KIRLOSKAR MOTOR PVT LTD", Apr25: 6.48, Mar25: 6.46, Apr24: 5.72 },
  { name: "KIA INDIA PRIVATE LIMITED", Apr25: 6.00, Mar25: 6.09, Apr24: 5.62 },
  { name: "MG MOTOR INDIA PVT LTD", Apr25: 1.35, Mar25: 1.43, Apr24: 1.21 },
  { name: "HONDA CARS INDIA LTD", Apr25: 1.34, Mar25: 1.36, Apr24: 1.77 },
  { name: "RENAULT INDIA PVT LTD", Apr25: 0.79, Mar25: 0.73, Apr24: 1.15 },
  { name: "NISSAN MOTOR INDIA PVT LTD", Apr25: 0.51, Mar25: 0.49, Apr24: 0.64 },
  { name: "MERCEDES-BENZ INDIA PVT LTD", Apr25: 0.34, Mar25: 0.39, Apr24: 0.41 },
  { name: "BMW INDIA PVT LTD", Apr25: 0.34, Mar25: 0.35, Apr24: 0.36 },
  { name: "FORCE MOTORS LIMITED", Apr25: 0.23, Mar25: 0.24, Apr24: 0.22 },
  { name: "Others", Apr25: 0.59, Mar25: 1.86, Apr24: 0.51 },
].filter(c => c.Apr25 !== 0 || c.Mar25 !== 0 || c.Apr24 !== 0);

// --- Helper Functions ---
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

// --- Chart Container with dynamic width ---
const ChartContainer = ({ children }) => {
  const [containerWidth, setContainerWidth] = useState(300);

  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      if (w >= 1200) setContainerWidth(600);
      else if (w >= 768) setContainerWidth(600);
      else setContainerWidth(300);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      style={{
        width: containerWidth,
        flexShrink: 0,
        scrollSnapAlign: "start",
        margin: "0 auto",
      }}
      className="text-center"
    >
      {children}
    </div>
  );
};

// --- Chart Component ---
const ChartWithComparison = ({ current, compare, title }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 576;
  const showSymbol = current === "Apr25";
  const data = getComparisonData(current, compare, showSymbol);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, symbol } = payload[0].payload;
    return (
      <div style={{ background: "#222", color: "#fff", padding: 8, borderRadius: 4, fontSize: 12 }}>
        <strong>{name}</strong><br />
        Value: {value.toFixed(2)}% {symbol}
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, index, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + (isMobile ? 20 : 30);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const item = data[index];
    if (!item) return null;

    const arrowColor = item.increased ? "green" : item.decreased ? "red" : "white";
    return (
      <text
        x={x}
        y={y}
        fill="#ccc"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 14}
        fontWeight="bold"
      >
        <tspan fill={arrowColor}>{item.symbol} </tspan>
        <tspan>{value.toFixed(1)}%</tspan>
      </text>
    );
  };

  return (
    <ChartContainer>
      <h6 className="mb-2">{title}</h6>
      <div style={{ width: "100%", height: isMobile ? 250 : 600 }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              {data.map((_, i) => (
                <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
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
              innerRadius={isMobile ? 40 : 120}
              outerRadius={isMobile ? 70 : 200}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.1)"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={`url(#grad-${i})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

// --- Main Component ---
const PassengerPieChart = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartConfigs = [
    { current: "Mar25", compare: "Apr24", title: "MoM - Mar 25" },
    { current: "Apr25", compare: "Mar25", title: "MoM - Apr 25" },
    { current: "Apr24", compare: "Apr25", title: "YoY - Apr 24" },
    { current: "Apr25", compare: "Apr24", title: "YoY - Apr 25" },
  ];

  return (
    <div className="container">
      <h5 className="text-center text-warning mb-3">
        Passenger Vehicle OEM Share Comparison
      </h5>

      {isMobile ? (
        <div className="text-center">
          <div className="mb-2">
            <button
              className="btn btn-outline-light btn-sm me-2"
              onClick={() => setMobileIndex((mobileIndex - 1 + chartConfigs.length) % chartConfigs.length)}
            >
              ◀ Prev
            </button>
            <span className="text-white small fw-semibold">{chartConfigs[mobileIndex].title}</span>
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={() => setMobileIndex((mobileIndex + 1) % chartConfigs.length)}
            >
              Next ▶
            </button>
          </div>
          <ChartWithComparison {...chartConfigs[mobileIndex]} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: 24,
            paddingBottom: 16,
            scrollSnapType: "x mandatory",
          }}
        >
          {chartConfigs.map((config, i) => (
            <ChartWithComparison key={i} {...config} />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="d-flex flex-wrap justify-content-center">
          {companyData.map((item, idx) => (
            <div
              key={idx}
              className="mx-2 my-1"
              style={{
                fontSize: 12,
                color: "#ccc",
                display: "flex",
                alignItems: "center",
                maxWidth: 150,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={item.name}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  background: getColor(idx),
                  borderRadius: 4,
                  marginRight: 6,
                }}
              />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerPieChart;

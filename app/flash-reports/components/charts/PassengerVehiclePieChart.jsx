'use client';

import React from "react";
import { useMediaQuery } from 'react-responsive';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: 8,
          borderRadius: 4,
          fontSize: 10,
          minWidth: 100,
          textAlign: "center",
        }}
      >
        <strong>{name}</strong>
        <br />
        Value: {value.toFixed(2)}% {symbol}
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
    const radius = outerRadius + 20; // push label outside the slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = data[index];
    if (!item) return null;

    let arrowColor = "#fff";
    if (item.increased) arrowColor = "green";
    else if (item.decreased) arrowColor = "red";

    return (
      <text
        x={x}
        y={y}
        fill="#ccc"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={isMobile ? 12 : 14}
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

const PassengerPieChart = () => {
  const chartConfigs = [
    { current: "Mar25", compare: "Apr24", title: "Month on Month (MoM) - Mar 25" },
    { current: "Apr25", compare: "Mar25", title: "Month on Month (MoM) - Apr 25" },
    { current: "Apr24", compare: "Apr25", title: "Year on Year (YoY) - Apr 24" },
    { current: "Apr25", compare: "Apr24", title: "Year on Year (YoY) - Apr 25" },
  ];

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col text-center">
          <h4 style={{ color: "#ffdc00" }}>
            Passenger Vehicle OEM Market Share Comparison
          </h4>
        </div>
      </div>

      <div className="row">
        {chartConfigs.map(({ current, compare, title }) => (
          <ChartWithComparison
            key={title}
            current={current}
            compare={compare}
            title={title}
          />
        ))}
      </div>

      {/* Shared Legend */}
      <div className="mt-3">
        <div
          className="d-flex flex-wrap justify-content-center gap-2"
          style={{ fontSize: "9px", lineHeight: "1.2" }}
        >
          {companyData.map((item, i) => (
            <div
              key={item.name}
              className="d-flex align-items-center"
              style={{ margin: "4px 6px", maxWidth: "45%" }}
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
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PassengerPieChart;

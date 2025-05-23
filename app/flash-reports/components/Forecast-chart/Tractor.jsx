'use client'

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
  Brush,
  Rectangle,
} from "recharts";

const rawData = [
 { month: 'Jan25', TRAC: 93381 },
  { month: 'Feb25', TRAC: 65574 },
  { month: 'Mar25', TRAC: 74013 },
  { month: 'Apr25', TRAC: 60915 },
  { month: 'May25', TRAC: 300000 },
  { month: 'Jun25', TRAC: 200000 },
  { month: 'Jul25', TRAC: 350000 },
  { month: 'Aug25', TRAC: 400000 }
];

const allowedMonths = ['Jan25', 'Feb25', 'Mar25', 'Apr25'];

const abbreviate = v => {
  if (v >= 1e9)   return `${(v / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (v >= 1e6)   return `${(v / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1e3)   return `${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return v.toString();
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#333', color: '#fff', padding: 10, borderRadius: 5 }}>
        <p>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TRACForecast = () => {
  const filteredData = useMemo(
    () => rawData.filter(d => allowedMonths.includes(d.month)),
    []
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: 420 }}>
      <ResponsiveContainer>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
          animationDuration={2500}
          animationEasing="ease-out"
        >
          <defs>
            <linearGradient id="tracGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#673AB7" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#673AB7" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#673AB7", fontSize: 12 }}
            domain={['auto', 'auto']}
 tickFormatter={abbreviate}            tickCount={5}
            interval="preserveStartEnd"
          />
          <Brush
            dataKey="month"
            startIndex={0}
            endIndex={filteredData.length - 1}
            height={12}
            stroke="rgba(255,255,255,0.4)"
            fill="rgba(255,255,255,0.08)"
            strokeWidth={1}
            tickFormatter={(d) => d}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 9 }}
            tickMargin={4}
            traveller={
              <Rectangle
                width={6}
                height={16}
                radius={3}
                fill="rgba(255,255,255,0.6)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1}
                cursor="ew-resize"
              />
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ marginTop: 24 }} />
          <Line
            dataKey="TRAC"
            name="TRAC"
            stroke="url(#tracGrad)"
            strokeWidth={3}
            dot={false}
            connectNulls
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '80%',
          width: '20%',
          height: 'calc(100% - 60px)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'silver',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        🔒 Subscribe to the Platinum Package to access forecast values.
      </div>
    </div>
  );
};

export default TRACForecast;

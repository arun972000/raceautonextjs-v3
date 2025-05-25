'use client';

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
} from 'recharts';
import { useMediaQuery } from 'react-responsive';
import '../styles/chart.css'

const rawData = [
  { month: 'Jan25', PV: 465920 },
  { month: 'Feb25', PV: 303398 },
  { month: 'Mar25', PV: 350603 },
  { month: 'Apr25', PV: 349939 },
  { month: 'May25', PV: 800000 },
  { month: 'Jun25', PV: 600000 },
  { month: 'Jul25', PV: 900000 },
  { month: 'Aug25', PV: 1000000 }
];

const allowedMonths = ['Jan25', 'Feb25', 'Mar25', 'Apr25', 'May25', 'Jun25', 'Jul25', 'Aug25'];
const isLockedMonth = month => ['Jun25', 'Jul25', 'Aug25'].includes(month);

const abbreviate = v => {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return v.toString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const isLocked = isLockedMonth(label) || label === 'May25';

  return (
    <div
      style={{
        background: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
        position: 'relative'
      }}
    >
      <p>{label}</p>
      {isLocked ? (
        <p style={{ color: '#ccc', fontStyle: 'italic' }}>🔒 Subscribe to view details</p>
      ) : (
        payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value?.toLocaleString()}
          </p>
        ))
      )}
    </div>
  );
};

const PVForecast = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const filteredData = useMemo(() => {
    return rawData
      .filter(d => allowedMonths.includes(d.month))
      .map(d => ({
        ...d,
        PV: isLockedMonth(d.month) ? null : d.PV,
      }));
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 0 }}>
      <ResponsiveContainer width="100%" height={isMobile ? 280 : 420}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 20, bottom: 20 }}
          animationDuration={2500}
          animationEasing="ease-out"
        >
          <defs>
            <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#009688" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#009688" stopOpacity={0.3} />
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
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={abbreviate}
            tickCount={5}
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
            dataKey="PV"
            name="PV"
            stroke="url(#pvGrad)"
            strokeWidth={3}
            dot={{ r: 3 }}
            connectNulls
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Forecast overlay panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '58%',
          width: '41%',
          height: 'calc(100% - 100px)',
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderLeft: '2px dashed rgba(255,255,255,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 8px',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: -1 // ⬅️ Lower than the tooltip
        }}
      >
       <p className="shining-white">
            🔒 Subscribe to the Platinum Package to access forecast values.
          </p>
      </div>
    </div>
  );
};

export default PVForecast;

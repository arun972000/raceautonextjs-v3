'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
import '../styles/chart.css'

const rawData = [
  { month: 'Jan25', CV: 99425 },
  { month: 'Feb25', CV: 82763 },
  { month: 'Mar25', CV: 94764 },
  { month: 'Apr25', CV: 90558 },
  { month: 'May25', CV: 400000 },
  { month: 'Jun25', CV: 150000 },
  { month: 'Jul25', CV: 450000 },
  { month: 'Aug25', CV: 500000 },
];

const allowedMonths = ['Jan25', 'Feb25', 'Mar25', 'Apr25', 'May25', 'Jun25', 'Jul25', 'Aug25'];
const isLockedMonth = (month) => ['Jun25', 'Jul25', 'Aug25'].includes(month);

const abbreviate = (v) => {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return v.toString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const isLocked = isLockedMonth(label) || label === 'May25';

  return (
    <div style={{ background: '#333', color: '#fff', padding: 10, borderRadius: 5 }}>
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

const CVForecast = () => {
  const [chartHeight, setChartHeight] = useState(() =>
    window.innerWidth < 768 ? 280 : 420
  );

  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth < 768 ? 280 : 420);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return rawData
      .filter((d) => allowedMonths.includes(d.month))
      .map((d) => ({
        ...d,
        CV: isLockedMonth(d.month) ? null : d.CV,
      }));
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', zIndex:0 }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 20, bottom: 20 }}
          animationDuration={2500}
          animationEasing="ease-out"
        >
          <defs>
            <linearGradient id="cvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3F51B5" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3F51B5" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
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
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
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
            dataKey="CV"
            name="CV"
            stroke="url(#cvGrad)"
            strokeWidth={3}
            dot={{ r: 3 }}
            connectNulls
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Overlay for forecast */}
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
          zIndex:-1,
          pointerEvents: 'none',
        }}
      >
        <p className="shining-white">
            🔒 Subscribe to the Platinum Package to access forecast values.
          </p>
      </div>
    </div>
  );
};

export default CVForecast;

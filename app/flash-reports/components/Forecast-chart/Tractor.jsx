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
import Link from 'next/link';

const rawData = [
  { month: 'Jan25', TRAC: 93381 },
  { month: 'Feb25', TRAC: 65574 },
  { month: 'Mar25', TRAC: 74013 },
  { month: 'Apr25', TRAC: 60915 },
  { month: 'May25', TRAC: 100000 },
  { month: 'Jun25', TRAC: 200000 },
  { month: 'Jul25', TRAC: 350000 },
  { month: 'Aug25', TRAC: 400000 }
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

const TRACForecast = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth(); // initialize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const isMobile = windowWidth <= 640;
  const chartHeight = isMobile ? 280 : 420;

  const filteredData = useMemo(() => {
    return rawData
      .filter(d => allowedMonths.includes(d.month))
      .map(d => ({
        ...d,
        TRAC: isLockedMonth(d.month) ? null : d.TRAC,
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
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }}
            tickFormatter={(d) => d}
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
            dot={{ r: 3 }}
            connectNulls
            animationBegin={0}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Forecast Overlay */}
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
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <p className="shining-white" style={{ pointerEvents: 'none' }}>
          🔒 Subscribe to the Platinum Package to access forecast values.
        </p>
      </div>

      {/* Transparent clickable link overlay */}
      <Link
        href="/subscription"
        style={{
          position: 'absolute',
         top: 20,
          left: '58%',
          width: '41%',
          height: 'calc(100% - 100px)',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        <span style={{ display: 'block', width: '100%', height: '100%' }} />
      </Link>
    </div>
  );
};

export default TRACForecast;

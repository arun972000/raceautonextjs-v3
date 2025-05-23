'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  CartesianGrid
} from 'recharts';

const rawData = [
  { month: 'JAN-25', LCV: 56410, MCV: 6975, HCV: 30061, Others: 597 },
  { month: 'FEB-25', LCV: 45742, MCV: 6212, HCV: 26094, Others: 471 },
  { month: 'MAR-25', LCV: 52380, MCV: 7200, HCV: 29436, Others: 574 },
  { month: 'APR-25', LCV: 46751, MCV: 7638, HCV: 31657, Others: 451 }
];

// Add Others to HCV, then remove Others, and calculate percentages
const data = rawData.map((item) => {
  const hcvWithOthers = item.HCV + item.Others;
  const total = item.LCV + item.MCV + hcvWithOthers;
  return {
    month: item.month,
    LCV: (item.LCV / total) * 100,
    MCV: (item.MCV / total) * 100,
    HCV: (hcvWithOthers / total) * 100
  };
});

const COLORS = {
  LCV: '#004c6d',
  MCV: '#f79256',
  HCV: '#227c32'
};

const CustomStackBarChart = () => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 50, left: 60, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <YAxis
            type="category"
            dataKey="month"
            tick={{ fontWeight: 'bold' }}
            width={80}
          />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend iconType="square" />

          <Bar dataKey="LCV" stackId="a" fill={COLORS.LCV}>
            <LabelList dataKey="LCV" position="inside" formatter={(val) => `${val.toFixed(1)}%`} fill="#fff" fontSize={12} />
          </Bar>
          <Bar dataKey="MCV" stackId="a" fill={COLORS.MCV}>
            <LabelList dataKey="MCV" position="inside" formatter={(val) => `${val.toFixed(1)}%`} fill="#fff" fontSize={12} />
          </Bar>
          <Bar dataKey="HCV" stackId="a" fill={COLORS.HCV}>
            <LabelList dataKey="HCV" position="inside" formatter={(val) => `${val.toFixed(1)}%`} fill="#fff" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomStackBarChart;

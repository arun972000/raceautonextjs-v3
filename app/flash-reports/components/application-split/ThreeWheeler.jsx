'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Passenger Transport', value: 55 },
  { name: 'Cargo Transport', value: 30 },
  { name: 'E-commerce Delivery', value: 8 },
  { name: 'Rental Services and Others', value: 7 },
];

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

const ThreeWheelerApplication = () => {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: 450 }}>
      <div
        style={{ position: 'relative', width: '100%', height: 350 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={renderLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backdropFilter: 'blur(3px)',
              background:
                'linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexDirection: 'column',
              padding: '1rem',
              textAlign: 'center',
              borderRadius: 4,
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                fontWeight: 700,
              }}
            >
              Access Full Insights
            </h2>
            <p
              style={{
                fontSize: '1rem',
                marginBottom: '1rem',
                color: '#ccc',
                maxWidth: '320px',
              }}
            >
              Subscribe to unlock detailed analytics and monthly performance data.
            </p>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'background 0.3s ease',
              }}
              onClick={() => router.push('/subscription')}
            >
              Subscribe Now
            </button>
          </div>
      
      </div>

      {/* Legend outside of blur overlay */}
      <div className="d-flex flex-wrap justify-content-center mt-1" style={{ gap: '10px'}}>
        {data.map((entry, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2"
            style={{ gap: 8, minWidth: 120 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                backgroundColor: colors[index % colors.length],
                borderRadius: 3,
              }}
            />
            <span style={{ fontSize: "0.6rem", textAlign: "left" }}>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeWheelerApplication;

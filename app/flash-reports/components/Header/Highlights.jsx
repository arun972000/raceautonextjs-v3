import React, { useEffect, useState } from 'react';

const Highlights = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 575);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fontSize = isMobile ? 14 : 20; // smaller font on mobile
  const paddingVertical = isMobile ? 4 : 6; // less vertical padding on mobile

  return (
    <div
      style={{
        color: 'white',
        paddingLeft: isMobile ? '1rem' : '3rem',
        paddingRight: isMobile ? '1rem' : '3rem',
        paddingBottom: isMobile ? '1rem' : '1.5rem',
        paddingTop: isMobile ? '0.5rem' : '0.5rem',
      }}
      className="px-lg-5 pb-lg-4 pt-lg-2"
    >
      <h2 style={{ fontSize: isMobile ? '1.25rem' : '2rem' }}>Highlights of the Report</h2>
      <ul style={{ fontSize }}>
        <li style={{ padding: `${paddingVertical}px 0`, textAlign: 'justify' }}>
          <span style={{ color: '#0CDFFF' }}>
            <b>Two-Wheelers (2W)</b>
          </span>
          : Stable performance, with slight MoM recovery; top brands maintain volume leadership.
        </li>
        <li style={{ padding: `${paddingVertical}px 0`, textAlign: 'justify' }}>
          <span style={{ color: '#0CDFFF' }}>
            <b>Three-Wheelers (3W)</b>
          </span>
          : Robust growth, driven by rising demand in urban mobility and last-mile delivery.
        </li>
        <li style={{ padding: `${paddingVertical}px 0`, textAlign: 'justify' }}>
          <span style={{ color: '#0CDFFF' }}>
            <b>Passenger Vehicles (PV)</b>
          </span>
          : Consistent market traction, led by compact SUVs and premium hatchbacks.
        </li>
        <li style={{ padding: `${paddingVertical}px 0`, textAlign: 'justify' }}>
          <span style={{ color: '#0CDFFF' }}>
            <b>Commercial Vehicles (CV)</b>
          </span>
          : Mixed performance, heavy-duty segment faces slowdown, while LCVs show resilience.
        </li>
        <li style={{ padding: `${paddingVertical}px 0`, textAlign: 'justify' }}>
          <span style={{ color: '#0CDFFF' }}>
            <b>Tractors</b>
          </span>
          : Seasonal demand uptick, supported by pre-monsoon agricultural activities.
        </li>
      </ul>
    </div>
  );
};

export default Highlights;

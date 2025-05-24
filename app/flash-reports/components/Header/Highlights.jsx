import React from 'react';

const Highlights = () => {
    return (
        <>
            <div
                style={{
                
                    color: 'white'
                }}
                className='px-lg-5 pb-lg-4 pt-lg-2'
            >
                <h2>Highlights of the Report</h2>
                <ul style={{ fontSize: 20 }}>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Two-Wheelers (2W)</b></span>: Stable performance, with slight MoM recovery; top brands maintain volume leadership.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Three-Wheelers (3W)</b></span>: Robust growth, driven by rising demand in urban mobility and last-mile delivery.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Passenger Vehicles (PV)</b></span>: Consistent market traction, led by compact SUVs and premium hatchbacks.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Commercial Vehicles (CV)</b></span>: Mixed performance, heavy-duty segment faces slowdown, while LCVs show resilience.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Tractors</b></span>: Seasonal demand uptick, supported by pre-monsoon agricultural activities.
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Highlights;

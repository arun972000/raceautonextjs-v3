import React from 'react';

const Highlights = () => {
    return (
        <>
            <div
                style={{
                    borderTopLeftRadius: 40,
                    borderBottomLeftRadius: 40,

                }}
                className='px-lg-5 pb-lg-4 pt-lg-2'
            >
                <h2>Highlights of the Report</h2>
                <ul style={{ fontSize: 20 }}>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Two-Wheelers (2W)</b></span>: Petrol dominates, but EVs like Ola Electric and Ather Energy are gaining, now at 2% market share.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Three-Wheelers (3W)</b></span>: Electric adoption is rising, with Bajaj Auto leading in CNG/petrol and EV segments.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Passenger Vehicles (PV)</b></span>: Petrol and Diesel dominate, with increasing CNG options from Maruti Suzuki, and EVs (e.g., BYD) growing.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Commercial Vehicles (CV)</b></span>: Mainly diesel, but CNG and electric trucks are emerging slowly, led by Tata Motors.
                    </li>
                    <li style={{ padding: '6px 0', textAlign: 'justify' }}>
                        <span style={{ color: '#0CDFFF' }}><b>Tractors</b></span>: Largely diesel-powered, with minimal electric adoption yet, Mahindra leads the segment.
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Highlights;

import dynamic from "next/dynamic";
import React from 'react';
import ForecastChart from '../charts/DummyLineChart';

const CustomPieChart = dynamic(() => import("../charts/PieChart"), { ssr: false });
const TwoWheelerEV = dynamic(() => import("../ev/TwoWheeler-EV"), { ssr: false });
const TwoWheelerForecast = dynamic(() => import("../Forecast-chart/Twowheeler"), { ssr: false });

const TwoWheeler = () => {
    return (
        <div className='px-lg-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h2>
                            Two-Wheeler OEM Performance – April 2025
                        </h2>
                        <p style={{ textAlign: 'justify' }}>
                            In April 2025, <span className='text-warning'>Hero MotoCorp</span> retained its position as the market leader with 5.11 lakh units sold, though its market share declined slightly to <span className='text-warning'>30.34%, down from 31.06%</span> in April 2024, indicating a marginal dip in dominance.

                            <span className='text-warning'>Honda Motorcycle</span> recorded healthy year-on-year growth in both volume and market share, rising to <span className='text-warning'>24.08% from 23.97%</span>, fuelled by sustained demand for its scooter range.

                            <span className='text-warning'>TVS Motor</span> posted notable gains, with its share increasing to <span className='text-warning'>18.34% from 17.04%</span>, reflecting consistent performance across both internal combustion engine (ICE) and electric vehicle (EV) segments.

                            <span className='text-warning'>Bajaj Auto</span> experienced a decline in both volume and share, falling to <span className='text-warning'>10.85% from 11.90%</span>, possibly due to market headwinds or transition within its product line-up.

                            Both <span className='text-warning'>Suzuki and Royal Enfield</span> improved their market positions, benefitting from strong brand loyalty and the successful launch of new models.

                            Among electric vehicle manufacturers, <span className='text-warning'>Ather Energy</span> stood out with a sharp increase in market share from <span className='text-warning'>0.25% to 0.78%</span>, while <span className='text-warning'>Ola Electric</span>, despite remaining the segment leader, saw its share fall from <span className='text-warning'>2.07% to 1.17%</span>.

                            The overall data reflects a stable ICE market with rising competition in the EV space, as new entrants gain traction and legacy OEMs adapt to evolving consumer preferences.
                        </p>
                    </div>

                    <div className='col-12 mt-3'>
                        <CustomPieChart />
                    </div>

                    <div className="col-12 mt-5">
                        <TwoWheelerEV />
                    </div>

                    <div className="col-12">
                        <h2 className="mt-4">
                            Forecast Chart
                        </h2>
                        <TwoWheelerForecast />
                    </div>

                    <div className="col-12">
                        <h2 className="mt-4">
                            Application Chart
                        </h2>
                        <ForecastChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoWheeler;

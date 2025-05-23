import dynamic from "next/dynamic";
import React from 'react';
import ForecastChart from '../charts/DummyLineChart';

const CustomPieChart = dynamic(() => import("../charts/PieChart"), { ssr: false });
const TwoWheelerEV = dynamic(() => import("../ev/TwoWheeler-EV"), { ssr: false });
const TwoWheelerForecast = dynamic(() => import("../Forecast-chart/Twowheeler"), { ssr: false });

const TwoWheeler = () => {
    return (
        <div className='px-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h2>
                            Two Wheeler OEM
                        </h2>
                        <p style={{ textAlign: 'justify' }}>
                            In April 2025, Hero MotoCorp retained the top spot with 5.11 lakh units, though its market share declined slightly to 30.34% from 31.06% in April 2024, indicating a marginal loss in dominance.
                            Honda Motorcycle posted healthy YoY growth in volume and share, rising to 24.08% from 23.97%, driven by continued scooter demand.
                            TVS Motor made notable gains, increasing its market share to 18.34% (up from 17.04%), reflecting consistent growth across ICE and EV offerings.
                            Bajaj Auto saw a decline both in volume and share, dropping to 10.85% from 11.90%, suggesting potential market pressure or product transition effects.
                            Suzuki and Royal Enfield both expanded their shares, benefiting from strong brand loyalty and new model traction.
                            Among EV players, Ather Energy stood out with a sharp rise from 0.25% to 0.78%, while Ola Electric’s share fell from 2.07% to 1.17%, despite remaining the segment leader.
                            The data reflects a stable ICE market with rising EV churn, as newer players gain ground and traditional OEMs adjust their positions.
                        </p>
                    </div>

                    <div className='col-12'>
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

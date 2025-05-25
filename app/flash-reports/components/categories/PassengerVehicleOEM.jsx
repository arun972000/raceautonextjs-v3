/* eslint-disable react/no-unescaped-entities */
import dynamic from "next/dynamic";
import React from 'react';
import FourWheelerEVShare from '../ev/FourWheeler-EV';

const PassengerVehicle_Piechart = dynamic(
    () => import("../charts/PassengerVehiclePieChart"),
    { ssr: false }
);

const FourWheelerApplication = dynamic(
    () => import("../application-split/FourWheeler"),
    { ssr: false }
);

import PassengerForecast from '../Forecast-chart/FourWheeler';

const TwoWheeler = () => {
    return (
        <div className='px-lg-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h3>
                            Passenger Vehicle Market Performance – April 2025
                        </h3>
                        <p style={{ textAlign: 'justify' }}>
                            In April 2025, <span className="text-warning">Maruti Suzuki</span> retained its position as the market leader in India’s passenger vehicle segment, selling 1,38,021 units and securing a <span className="text-warning">39.44%</span> market share. However, this represented a slight decline from <span className="text-warning">40.39%</span> in April 2024, indicating intensifying competition.


                            <span className="text-warning">Mahindra & Mahindra</span> recorded significant year-on-year growth, increasing its share to <span className="text-warning">13.83% from 11.23%</span>, largely driven by the strong demand for its SUVs such as the XUV700 and Thar.

                            <span className="text-warning">Tata Motors</span> experienced a marginal decline in market share, slipping to <span className="text-warning">12.59% from 13.61%</span>, despite continued success in both the electric and SUV categories.

                            <span className="text-warning">Hyundai Motor India</span> also saw a reduction, with its share falling from <span className="text-warning">14.29% in April 2024 to 12.47%</span>, likely due to rising pressure from domestic competitors.

                            Conversely, both <span className="text-warning">Toyota and Kia</span> reported year-on-year gains. Toyota’s share rose to <span className="text-warning">6.67%</span>, while Kia reached <span className="text-warning">6.18%</span>, reflecting growing customer interest in their newer models.
                        </p>
                    </div>

                    <div className='col-12 mt-3'>
                        <PassengerVehicle_Piechart />
                    </div>

                    <div className="col-12 mt-5 pt-0">
                        <p style={{ textAlign: 'justify' }}>
                            Skoda Auto, part of the Volkswagen Group, saw significant gains, with a combined share of 2.70% (up from 1.97%), bolstered by the launch of new models. MG Motor continued to grow, with a share of 1.39%, up from 1.24% last year.
                       
                            Luxury Brands such as Mercedes-Benz and BMW had relatively stable performances, while BYD made a notable entry with a 0.10% market share, indicating a positive reception for electric vehicles in the premium segment.
                      
                            Overall, the Indian PV market continues to evolve with shifting dynamics, where traditional leaders like Maruti face stronger competition from both homegrown players and international OEMs, especially in the SUV and electric vehicle sectors.
                        </p>
                    </div>

                    <div className="col-12">
                        <FourWheelerEVShare />
                    </div>

                    <div className="col-12">
                        <h3 className="mt-4">
                            Forecast Chart
                        </h3>
                        <PassengerForecast />
                    </div>

                    <div className="col-12">
                        <h3 className="mt-4">
                            Application Chart
                        </h3>
                        <FourWheelerApplication />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoWheeler;

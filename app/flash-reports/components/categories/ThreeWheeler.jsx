import dynamic from "next/dynamic";
import ThreeWheelerEV from "../ev/Threewheeler-EV";

const ThreeWheeler_Piechart = dynamic(
    () => import("../charts/ThreeWheeler-PieChart"),
    { ssr: false }
);

const ThreeWheelerApplication = dynamic(
    () => import("../application-split/ThreeWheeler"),
    { ssr: false }
);

const ThreeWheelerForecast = dynamic(
    () => import("../Forecast-chart/ThreeWheeler"),
    { ssr: false }
);

const ThreeWheeler = () => {
    return (
        <div className='px-lg-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h3>
                            Three-Wheeler Market Summary – April 2025
                        </h3>
                        <p style={{ textAlign: 'justify' }}>
                            India’s three-wheeler segment continued its upward trajectory in April 2025, registering 99,766 units, marking a robust 24.5% year-on-year growth compared to April 2024. This performance reflects growing demand in both passenger and cargo sub-segments, with electric vehicles (EVs) driving much of the momentum.

                            EV penetration reached a new high, accounting for 62.7% of total 3W sales—up significantly from 52.5% a year earlier. This reinforces the segment’s rapid transition towards sustainable mobility, supported by favourable policies, low running costs, and increasing urban adoption.

                            <span className='text-warning'>Bajaj Auto</span> maintained its leadership with 32,638 units sold, securing a <span className='text-warning'>32.7%</span> market share, while <span className='text-warning'>Mahindra Group and TVS Motor Company</span> delivered standout performances. Mahindra recorded a remarkable <span className='text-warning'>64.8%</span> year-on-year growth, and <span className='text-warning'>TVS</span> nearly doubled its volumes with a <span className='text-warning'>98.2%</span> increase, reflecting strong traction in electric and goods-focused models.

                            Other notable players included <span className='text-warning'>Piaggio Vehicles, Y.C. Electric, and Atul Auto</span>, each contributing steadily to the segment’s diversification.
                        </p>
                    </div>

                    <div className='col-12 mt-3'>
                        <ThreeWheeler_Piechart />
                    </div>

                    <div className="col-12 mt-5">
                        <ThreeWheelerEV />
                    </div>

                    <div className="col-12">
                        <h3 className="mt-4">
                            Forecast Chart
                        </h3>
                        <ThreeWheelerForecast />
                    </div>

                    <div className="col-12 mt-5">
                        <h3 className="mt-4">
                            Application Chart
                        </h3>
                        <ThreeWheelerApplication />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThreeWheeler;

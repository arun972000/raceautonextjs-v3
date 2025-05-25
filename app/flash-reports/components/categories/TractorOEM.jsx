import dynamic from "next/dynamic";
import TractorApplication from "../application-split/Tractor";

const Tractor_Piechart = dynamic(
    () => import("../charts/TractorPieChart"),
    { ssr: false }
);

import TractorForecast from '../Forecast-chart/Tractor';

const TractorOEM = () => {
    return (
        <div className='px-lg-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h3>
                            Tractor OEM
                        </h3>
                        <p style={{ textAlign: 'justify' }}>
                            In April 2025, <span className="text-warning">Mahindra & Mahindra</span> continued to dominate the tractor market, with a combined share of <span className="text-warning">42.08%</span> from both its Tractor and Swaraj Division. This is a slight increase from 41.84% in April 2024, reflecting consistent demand for its products across rural and agricultural sectors.
                            <span className="text-warning">TAFE</span> posted strong growth, increasing its market share to <span className="text-warning">11.23% from 9.92%</span>, indicating robust performance in the mid-range tractor segment. Similarly, <span className="text-warning">Escorts Kubota</span> maintained a stable position with a market share of <span className="text-warning">10.43%, up slightly from 10.37%</span>.
                            <span className="text-warning">International Tractors and John Deere</span> continued to perform well, with International Tractors seeing a small dip in market share from <span className="text-warning">13.10% to 12.78%</span>, while John Deere had a modest decrease from <span className="text-warning">8.39% to 8.24%</span>.
                            <span className="text-warning">Kubota</span> saw a noticeable decline, dropping from <span className="text-warning">1.90% to 1.28%</span>, potentially due to increased competition or shifting market preferences.
                            The ‘Others’ category grew to <span className="text-warning">3.75%, up from 3.36%</span>, indicating a rise in smaller players and <span className="text-warning">niche brands</span> entering the tractor market.
                            Overall, the tractor market remains competitive, with <span className="text-warning">Mahindra</span> leading, but increasing pressure from <span className="text-warning">TAFE, Escorts</span>, and other smaller players driving the evolution of the sector.
                        </p>
                    </div>

                    <div className='col-12 mt-3'>
                        <Tractor_Piechart />
                    </div>

                    <div className="col-12">
                        <h3 className="mt-4">
                            Forecast Chart
                        </h3>
                        <TractorForecast />
                    </div>

                    <div className="col-12">
                        <h3 className="mt-4">
                            Application Chart
                        </h3>
                        <TractorApplication />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TractorOEM;

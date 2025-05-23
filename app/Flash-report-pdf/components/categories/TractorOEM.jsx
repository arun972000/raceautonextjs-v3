import dynamic from "next/dynamic";
import TractorApplication from "../application-split/Tractor";

const Tractor_Piechart = dynamic(
    () => import("../charts/TractorPieChart"),
    { ssr: false }
);

import TractorForecast from '../Forecast-chart/Tractor';

const TractorOEM = () => {
    return (
        <div className='px-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h3>
                            Tractor OEM
                        </h3>
                        <p style={{ textAlign: 'justify' }}>
                            In April 2025, Mahindra & Mahindra continued to dominate the tractor market, with a combined share of 42.08% from both its Tractor and Swaraj Division. This is a slight increase from 41.84% in April 2024, reflecting consistent demand for its products across rural and agricultural sectors.
                            TAFE posted strong growth, increasing its market share to 11.23% from 9.92%, indicating robust performance in the mid-range tractor segment. Similarly, Escorts Kubota maintained a stable position with a market share of 10.43%, up slightly from 10.37%.
                            International Tractors and John Deere continued to perform well, with International Tractors seeing a small dip in market share from 13.10% to 12.78%, while John Deere had a modest decrease from 8.39% to 8.24%.
                            Kubota saw a noticeable decline, dropping from 1.90% to 1.28%, potentially due to increased competition or shifting market preferences.
                            The ‘Others’ category grew to 3.75%, up from 3.36%, indicating a rise in smaller players and niche brands entering the tractor market.
                            Overall, the tractor market remains competitive, with Mahindra leading, but increasing pressure from TAFE, Escorts, and other smaller players driving the evolution of the sector.
                        </p>
                    </div>

                    <div className='col-12'>
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

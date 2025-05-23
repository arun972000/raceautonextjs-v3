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
    () => import("../Forecast-chart/Twowheeler"),
    { ssr: false }
);

const ThreeWheeler = () => {
    return (
        <div className='px-4'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-12'>
                        <h3>
                            3-Wheeler OEM
                        </h3>
                        <p style={{ textAlign: 'justify' }}>
                            The automotive industry is a major global sector encompassing the design, manufacturing, marketing, and sale of motor vehicles. It includes a wide range of participants such as original equipment manufacturers (OEMs), parts suppliers, dealerships, and aftermarket service providers. In recent years, the industry has been undergoing a significant transformation driven by trends such as electrification, autonomous driving technology, and digital connectivity. Electric vehicles (EVs) are gaining traction as governments enforce stricter environmental regulations and consumers demand cleaner transportation options. At the same time, innovations in software and artificial intelligence are reshaping
                        </p>
                    </div>

                    <div className='col-12'>
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

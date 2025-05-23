import React from 'react'
import LineChartWithTotal from '../charts/LineCharts'
import RechartsChart from '../charts/customizechart'

const OverAll = () => {
    return (
        <div className='px-lg-4'>
            <div className='container-fluid'>
                {/* <DownloadAllButton/> */}
                <div className='row'>
                    <h2>
                        Overall Automotive Industry
                    </h2>
                    <div className='col-12 px-2'>
                        <LineChartWithTotal />
                        <p className='mt-5' style={{ textAlign: 'justify' }}>
                            In April 2025, the Two-Wheeler (2W) segment recorded 1,686,774 units, showing a strong month-on-month growth from 1.51 million in March and 1.35 million in February, marking the highest volume in the last four months. Three-Wheeler (3W) sales remained largely flat at 99,766 units, with negligible change from March (99,376) and February (94,181), though still below January’s 107,033. Passenger Vehicle (PV) sales were steady at 349,939 units, nearly the same as March (350,603), but significantly lower than January’s peak of 465,920. The Tractor (TRAC) segment saw a drop to 60,915 units, down from 74,013 in March and 93,381 in January, continuing its downward trajectory. Commercial Vehicle (CV) sales in April stood at 90,558 units, a slight decrease from March (94,764) and January (99,425). Overall, April saw a strong recovery in 2Ws, stability in PVs and 3Ws, and continued weakness in the TRAC and CV segments.
                        </p>
                    </div>
                    <div className='col-12'>
                        <RechartsChart />
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            In Two-Wheelers (2W), Petrol/Ethanol remains dominant with a share of 94.34%, slightly up from March 2025 (91.10%), but below April 2024 (96.02%). Electric Vehicles (EVs) saw a drop to 5.44% from March’s 8.65%, indicating a temporary slowdown in adoption. CNG/LPG continues to have a marginal presence at just 0.22%.
                        </p>
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            For Three-Wheelers (3W), EVs have strengthened their lead, rising to 62.68% in April 2025, up from 59.93% in March and 52.49% in April 2024, reflecting strong momentum in electrification. CNG/LPG declined to 25.92%, and Diesel also dropped to 10.92%, showing a steady shift away from fossil fuels. Petrol penetration remains negligible at 0.48%.
                            In the Passenger Vehicle (PV) segment, Petrol/Ethanol accounted for 49.97%, recovering from 43.43% in March, though still below April 2024’s 53.31%. Diesel stayed stable at 18.47%, while CNG/LPG slightly decreased to 19.67%. Hybrid vehicles maintained moderate penetration at 8.40%, and EVs held steady at 3.50%, showing gradual but stable adoption.
                            The Commercial Vehicle (CV) segment remains Diesel-dominated at 84.73%, consistent with previous months. CNG/LPG penetration slightly improved to 10.58%, while EVs remained marginal at 0.99%. Hybrid and Hydrogen technologies held negligible shares, unchanged from prior months.
                        </p>
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            In the Tractor segment, Diesel continues to dominate overwhelmingly at 99.98%, with only trace levels of Petrol (0.01%) and EV (0.01%), consistent across the observed period.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverAll

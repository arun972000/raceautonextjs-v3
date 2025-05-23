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
                            In April 2025, the <span className='text-warning'>Two-Wheeler (2W)</span> segment recorded 1,686,774 units, reflecting strong month-on-month growth from 1.51 million in March and 1.35 million in February, marking the highest volume in the past four months. <span className='text-warning'>Three-Wheeler (3W)</span> sales remained broadly stable at 99,766 units, showing minimal change from March (99,376 units) and February (94,181 units), although still trailing January’s peak of 107,033 units. <span className='text-warning'>Passenger Vehicle (PV)</span> sales held steady at 349,939 units, virtually unchanged from March (350,603 units), but significantly lower than the January high of 465,920 units. <span className='text-warning'>The Tractor (TRAC)</span> segment experienced a decline to 60,915 units, down from 74,013 in March and 93,381 in January, continuing its downward trend. <span className='text-warning'>Commercial Vehicle (CV)</span> sales in April stood at 90,558 units, slightly down from 94,764 in March and 99,425 in January. Overall, April witnessed a robust recovery in 2Ws, stability in PVs and 3Ws, and continued weakness in the TRAC and CV segments.</p></div>
                    <div className='col-12'>
                        <RechartsChart />
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            In April 2025, India’s alternative fuel vehicle market showed mixed trends across segments:
                        </p>
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            Electric Vehicles (EVs) continued to dominate the three-wheeler (3W) category, reaching 62.68% market share, reflecting strong policy push and urban adoption. The passenger vehicle (PV) segment maintained steady momentum, with EVs at 3.50%, hybrids at 8.40%, and CNG/LPG at 19.67%, largely driven by OEMs like Maruti Suzuki and BYD.
                            In the two-wheeler (2W) segment, EV penetration dropped slightly to 5.44% from March's 8.65%, despite strong sales volumes—indicating a temporary correction. Commercial vehicles (CVs) remained diesel-heavy, but CNG uptake improved to 10.58%, with EVs holding at 0.99%, led by early adopters like Tata Motors.
                            The tractor segment saw no significant shift, with diesel dominating at 99.98%, and only negligible alternative fuel presence.
                        </p>
                        <p className='mt-2' style={{ textAlign: 'justify' }}>
                            Overall, alternative fuels are gaining ground in 3Ws, PVs, and select CV applications, while electrification in 2Ws is stabilising. Tractors remain largely untouched due to operational demands.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverAll

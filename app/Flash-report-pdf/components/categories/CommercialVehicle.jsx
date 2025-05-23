import React from 'react'
import CustomStackBarChart from '../charts/stackVerticalChart'
import CM_Piechart from '../charts/CM-PieChart'
import BusMarketShare from '../ev/EV-Bus'
import CommercialVehicleReport from '../Forecast-chart/CommercialVehicle'
import CommercialVehicleReportTable from '../ev/CommercialVehicle'
import Image from 'next/image'
import Link from 'next/link'

const CommercialVehicle = () => {
    const justify = { textAlign: 'justify' };

    return (
        <>
            <div className='px-lg-4'>
                <div className='container-fluid'>
                    <h2>Commercial Vehicles</h2>
                    <CustomStackBarChart />
                    <p style={justify}>
                        The automotive industry is a major global sector encompassing the design, manufacturing, marketing, and sale of motor vehicles. It includes a wide range of participants such as original equipment manufacturers (OEMs), parts suppliers, dealerships, and aftermarket service providers. In recent years, the industry has been undergoing a significant transformation driven by trends such as electrification, autonomous driving technology, and digital connectivity. Electric vehicles (EVs) are gaining traction as governments enforce stricter environmental regulations and consumers demand cleaner transportation options.
                    </p>
                    <div className="row">
                        <div className='col-12 mt-4'>
                            <h3>Commercial Vehicles OEM</h3>
                            <p style={justify}>
                                In April 2025, Tata Motors continued to lead the commercial vehicle market with 30,398 units sold, though its market share declined to 33.57%, down from 35.42% in April 2024, reflecting increasing competition.
                            </p>
                            <p style={justify}>
                                Mahindra & Mahindra maintained its strong position with 23.24% share, up from 22.60%, while Ashok Leyland saw a slight dip, dropping to 17.41% from 18.18%.
                            </p>
                            <p style={justify}>
                                VE Commercial Vehicles improved its share marginally to 8.35%, reflecting steady growth, while Force Motors posted a notable YoY jump, increasing from 2.03% to 3.66%, driven by strong demand in the small commercial vehicle segment.
                            </p>
                            <p style={justify}>
                                Maruti Suzuki remained stable with 3.53%, and Daimler India held steady at 2.19%. Other smaller OEMs, including SML Isuzu, showed modest growth, while the Others category accounted for 6.72%, slightly down from 7.08% in April 2024.
                            </p>
                            <p style={justify}>
                                Overall, the market sees increasing fragmentation, with Tata Motors holding on to the lead despite facing stronger competition, especially from Mahindra and Force Motors.
                            </p>
                        </div>
                        <div className='col-12'><CM_Piechart /></div>
                        <div className='col-12'>
                            <h3 className="mt-4">Forecast Chart</h3>
                            <CommercialVehicleReport />
                        </div>
                        <div className='col-12 mt-3'>

                       
                        <Link href='/subscription'><div style={{ width: '100%', position: 'relative', aspectRatio: '4.18/1' }}>
                            <Image src="/images/fr-table.jpg" alt='flash-report-table' fill />
                        </div></Link>
                         </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommercialVehicle

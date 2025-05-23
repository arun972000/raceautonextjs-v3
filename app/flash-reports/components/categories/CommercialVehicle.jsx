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


                    <div className="row">
                        <div className='col-12 mt-4'>
                            <h3>Commercial Vehicle OEM Performance – April 2025</h3>
                            <p style={justify}>
                                In April 2025, Tata Motors retained its leadership in the commercial vehicle segment with 30,398 units sold. However, its market share declined to 33.57%, down from 35.42% in April 2024, signalling rising competitive pressure.

                            </p>
                            <p style={justify}>
                                Mahindra & Mahindra maintained a strong position, increasing its share to 23.24% from 22.60%, while Ashok Leyland experienced a slight decline, with its share dipping to 17.41% from 18.18% year-on-year.

                            </p>
                            <p style={justify}>
                                VE Commercial Vehicles posted a marginal improvement in share, reaching 8.35%, reflecting steady performance. Force Motors recorded a significant year-on-year rise, growing from 2.03% to 3.66%, driven by robust demand in the small commercial vehicle segment.

                            </p>
                            <p style={justify}>
                                Maruti Suzuki remained stable at 3.53%, while Daimler India also held firm at 2.19%. Other smaller OEMs, such as SML Isuzu, registered modest growth. The ‘Others’ category accounted for 6.72%, slightly lower than 7.08% in April 2024.
                            </p>
                            <p style={justify}>
                                Overall, the commercial vehicle market is witnessing increasing fragmentation, with Tata Motors continuing to lead amid growing competition, particularly from Mahindra and Force Motors.
                            </p>
                        </div>


                        <div className='col-12 mt-3'><CM_Piechart /></div>

                        <div className='col-12 mt-5'>
                            <h3>Commercial Vehicles Segmental Split</h3>
                            <CustomStackBarChart />
                        </div>

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

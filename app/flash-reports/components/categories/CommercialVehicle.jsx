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
                                In April 2025, <span className='text-warning'>Tata Motors</span> retained its leadership in the commercial vehicle segment with 30,398 units sold. However, its market share declined to <span className='text-warning'>33.57%, down from 35.42%</span> in April 2024, signalling rising competitive pressure.


                                <span className='text-warning'>Mahindra & Mahindra</span> maintained a strong position, increasing its share to <span className='text-warning'>23.24% from 22.60%</span>, while <span className='text-warning'>Ashok Leyland</span> experienced a slight decline, with its share dipping to <span className='text-warning'>17.41% from 18.18%</span> year-on-year.


                                <span className='text-warning'>VE Commercial Vehicles</span> posted a marginal improvement in share, reaching <span className='text-warning'>8.35%</span>, reflecting steady performance. <span className='text-warning'>Force Motors</span> recorded a significant year-on-year rise, growing from <span className='text-warning'>2.03% to 3.66%</span>, driven by robust demand in the small commercial vehicle segment.


                                <span className='text-warning'>Maruti Suzuki</span> remained stable at <span className='text-warning'>3.53%</span>, while <span className='text-warning'>Daimler India</span> also held firm at <span className='text-warning'>2.19%</span>. Other smaller OEMs, such as <span className='text-warning'>SML Isuzu</span>, registered modest growth. The ‘Others’ category accounted for <span className='text-warning'>6.72%</span>, slightly lower than 7.08% in April 2024.


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
                            <Link href='/subscription'><div style={{ width: '100%', position: 'relative', aspectRatio: '4.18/1', border: '1px solid white' }}>
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

'use client'
import React, { useRef } from 'react'
import FlashReportLineChart from './dynamic-charts/LineCharts'
import './styles/chart.css'
import CustomizedChart from './dynamic-charts/customizechart'
import { useReactToPrint } from "react-to-print";
import Contents from './contents'
import Highlights from './Header/Highlights'
import Image from 'next/image'

const FlashReportsHome = () => {
    const contentRef = useRef(null);
    // const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <>
            {/* <button onClick={reactToPrintFn}>Print</button> */}
            <div className='container-fluid'>
                <div style={{ position: 'relative', width: '100%' }} className='mb-1 flash-banner'>
                    {/* Desktop Banner */}
                    <div className="banner-desktop">
                        <Image
                            src='/images/flash-report-banner-2.jpg'
                            alt='flash-reports-banner'
                            fill
                            className="image-fit"
                            priority
                        />
                    </div>

                    {/* Mobile Banner */}
                    <div className="banner-mobile">
                        <Image
                            src='/images/flash-report-mobile.jpeg' // use your mobile version image here
                            alt='flash-reports-banner-mobile'
                            fill
                            className="image-fit"
                            priority
                        />
                    </div>
                </div>

                <div className='container-fluid ms-lg-2'>
                    <div className='row g-0 m-0 p-0 justify-content-between'>
                        <div className='col-12 col-lg-4 '>
                            <Contents />
                        </div>
                        <div className='col-12 col-lg-6 col-xl-8' >
                            <Highlights />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FlashReportsHome

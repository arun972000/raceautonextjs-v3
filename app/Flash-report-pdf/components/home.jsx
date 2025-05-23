'use client'
import React, { useRef } from 'react'
import FlashReportLineChart from './charts/LineCharts'
import './styles/chart.css'
import CustomizedChart from './charts/customizechart'
import { useReactToPrint } from "react-to-print";
import Contents from './contents'
import Highlights from './Header/Highlights'
import Image from 'next/image'

const FlashReportsHome = () => {
    const contentRef = useRef(null);
    // const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <>
            {/* <btton onClick={reactToPrintFn}>Print</btton> */}
            <div className='container-fluid'>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4.17/1' }} className='mb-1'>
                    <Image src='/images/flash-report-banner-2.jpg' alt='flash-reports-banner' fill />

                    {/* Overlay Text */}

                </div>
                <div className='container-fluid ms-2'>
                    <div className='row g-0 m-0 p-0 justify-content-between'>
                        <div className='col-12 col-md-4 '>
                            <Contents />
                        </div>
                        <div className='col-12 col-md-6 col-lg-8' >
                            <Highlights />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FlashReportsHome
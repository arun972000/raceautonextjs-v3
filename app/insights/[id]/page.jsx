import React from 'react'
import InsightDetailPage from './Insight'
import BreakingNews from '@/components/BreakingNews/BreakingNews'
import Navbar_V2 from '@/components/Navbar/Navbar_v2'
import MobileNavNew from '@/components/MobileNavbarNew/MobileNavNew'
import Footer from '@/components/Footer/Footer'


const page = () => {
  return (
    <>

      <BreakingNews />
      <Navbar_V2 />
      <MobileNavNew />
      <div className="main_content__position"><InsightDetailPage /></div>
      <Footer />
    </>
  )
}

export default page
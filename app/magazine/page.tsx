export const dynamic = "force-dynamic";

import React from "react";
import Magazine_v2 from "./Magazine-v2";
import BreakingNews from "@/components/BreakingNews/BreakingNews";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import MobileNavNew from "@/components/MobileNavbarNew/MobileNavNew";
import GreenBar from "@/components/GreenBar/MagazineBar";

const page = () => {
  return (
    <>
      <BreakingNews />
      <Navbar />
      <MobileNavNew/>
      <div className="main_content__position"><Magazine_v2 /></div>
      <Footer />
      <GreenBar/>
    </>
  );
};

export default page;

/* eslint-disable @next/next/inline-script-id */
export const dynamic = "force-dynamic";
import React from "react";

import BreakingNews from "@/components/BreakingNews/BreakingNews";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import GreenBar from "@/components/GreenBar/MagazineBar";
import Script from "next/script";
import { cookies } from "next/headers";
import PricingTable from "./component/ComparisonTable";
import MobileNavNew from "@/components/MobileNavbarNew/MobileNavNew";
import SubscriptionPage from "./component/subscription-v2/SubscriptionPage";
import PageViewTracker from "../pageTracker";

const page = async () => {
  const cookieStore = await cookies();
  const token: any = cookieStore.get("authToken");
  return (
    <>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <PageViewTracker page="subscription" />
      <BreakingNews />
      <Navbar />
      <MobileNavNew />
      <div className="main_content__position">
        <SubscriptionPage />
        {/* <PricingTable /> */}
      </div>
      <Footer />
      <GreenBar />
    </>
  );
};

export default page;

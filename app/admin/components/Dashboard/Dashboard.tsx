import React from "react";
import DashboardCard from "./DashboardCard";
import dynamic from "next/dynamic";
const MyBarChart = dynamic(() => import("./BarChart"), { ssr: false });
const PieChartAdmin = dynamic(() => import("./PieChart"), { ssr: false });
const ExcelUpload = dynamic(() => import("./ExcelUpload"), { ssr: false });
import { FaClipboardList, FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdEventAvailable } from "react-icons/md";


export type viewsCardType = {
  id: number;
  image_mid: string;
  title: string;
  pageviews: number;
};

const Dashboard = async () => {
  const cardResponse = await fetch(
    `${process.env.BACKEND_URL}api/admin/dashboard/card-numbers`
  );

  const cardData = await cardResponse.json();

  const viewsCardResponse = await fetch(
    `${process.env.BACKEND_URL}api/admin/dashboard/most-views`,
    { cache: "no-store" }
  );

  const viewsCardData = await viewsCardResponse.json();

  return (
    <div className="row mt-4">
      <DashboardCard
        total={cardData.totalPost}
        title="Post"
        bgcolor="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(18,64,223,1) 0%, rgba(168,187,235,1) 100%)"
        icon={<FaClipboardList className="ms-2" size={40} />}
      />

      <DashboardCard
        total={cardData.totalUser}
        title="User"
        bgcolor="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(244,241,31,1) 0%, rgba(237,238,190,1) 100%)"
        icon={<FaUser className="ms-2" size={40} />}
      />
      <DashboardCard
        total={cardData.totalMagazine}
        title="Magazine"
        bgcolor="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(46,244,31,1) 0%, rgba(193,238,190,1) 100%)"
        icon={<IoIosMail className="ms-2" size={40} />}
      />
      <DashboardCard
        total={cardData.totalevents}
        title="Event"
        bgcolor="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(244,70,31,1) 0%, rgba(238,199,190,1) 100%)"
        icon={<MdEventAvailable className="ms-2" size={40} />}
      />
      <div className="col-md-8 mt-3">
        <MyBarChart />
      </div>
      <div className="col-md-4 mt-3">
        <PieChartAdmin />
      </div>
      <div className="col-12 mt-3">
        <ExcelUpload />
      </div>
    </div>
  );
};

export default Dashboard;

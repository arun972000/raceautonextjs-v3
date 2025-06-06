import React from "react";

import "./sidebar.css";
import Image from "next/image";
import LatestNewsSwiper from "./LatestNewsList";

import { FaCrown } from "react-icons/fa";
import ExclusiveNewsSwiper from "./ExclusiveNewsList";
import AdSidebar from "../GoogleAds/AdSidebar";
import Link from "next/link";

export type LatestNewsType = {
  id: number;
  title: string;
  title_slug: string;
  // image_mid: any;
};

export type RecommendedType = {
  image_small: any;
  created_at(created_at: any): React.ReactNode;
  id: number;
  title: string;
  title_slug: string;
  image_mid: string;
};

const Sidebar = async () => {
  const latestnewsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/latest-news`,
    { cache: "no-store" }
  );
  const LatestNewsData: LatestNewsType[] = await latestnewsResponse.json();

  const recommendedResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/recommended-news`,
    { cache: "no-store" }
  );

  const ExclusiveNewsData: RecommendedType[] = await recommendedResponse.json();

  const sidebarTopres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/sidebar_top`,
    { cache: "no-store" }
  );

  const sidebarTopData = await sidebarTopres.json();

  const sidebarbottomres = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/adspace/sidebar_bottom`,
    { cache: "no-store" }
  );

  const sidebarbottomData = await sidebarbottomres.json();

  const eventSettingsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/event/settings`,
    { cache: "no-store" }
  );
  const eventSettingsData = await eventSettingsRes.json();

  return (
    <div className="col-lg-4 mb-4">
      {/* <AdSidebar /> */}
      <div className="row mt-1">
        <div className="col-12">
          <div>
            {/* <div
              className="side-scrollbar side-scrollbar-primary"
             
            >
              <ExclusiveNewsSwiper ExclusiveNewsData={ExclusiveNewsData} />
            </div> */}
          </div>
        </div>
        <div
          className="my-4"
          style={{ position: "relative", aspectRatio: "1/1", width: "100%" }}
        >
          <Link href="/subscription">
            {" "}
            <Image
              unoptimized
              src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${sidebarTopData[0].ad_code_300}`}
              alt="sidebar top"
              fill
            />
          </Link>
        </div>
        <div className="col-12">
          <h6
            style={{
              backgroundColor: "#0192ef",
              padding: 5,
              color: "white",
              fontWeight: 600,
              fontStyle: "normal",
            }}
          >
            Latest News
          </h6>
          <LatestNewsSwiper latestNewsData={LatestNewsData} />
        </div>
      </div>

      <div
        className="my-4"
        style={{ position: "relative", aspectRatio: "1/1", width: "100%" }}
      >
        <Link href="/subscription">
          <Image
            unoptimized
            src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${sidebarbottomData[0].ad_code_300}`}
            alt="sidebar top"
            fill
          />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

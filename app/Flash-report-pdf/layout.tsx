import React from "react";
import FlashReportsHome from "./components/home";
import { Bricolage_Grotesque } from "next/font/google";
import "./components/styles/flashReports.css";
import ReportsFooter from "./components/Footer";
import Header from "./components/Header/Header";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DownloadAllButton from "./components/DownloadButton";

// Import the font with desired subsets and weights
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



export default async function FlashReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get auth token from cookies

  // Render layout if subscription is valid
  return (
    <div className={`${bricolage.className}`}>
      <Header />
      <FlashReportsHome />
      {children}
      <ReportsFooter />
    </div>
  );
}

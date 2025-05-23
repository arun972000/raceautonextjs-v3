import React from "react";
import FlashReportsHome from "./components/home";
import { Bricolage_Grotesque } from "next/font/google";
import "./components/styles/flashReports.css";
import ReportsFooter from "./components/Footer";
import Header from "./components/Header/Header";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DownloadAllButton from "../Flash-report-pdf/components/DownloadButton";

// Font setup
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Define token structure
type JwtPayload = {
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
};

export default async function FlashReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    redirect("/");
  }

  // Decode token
  let email: string | undefined;
  let role: string | undefined;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    email = decoded.email;
    role = decoded.role;
  } catch (err) {
    console.error("Invalid token:", err);
    redirect("/");
  }

  if (!email) {
    redirect("/");
  }

  const specialRoles = ["admin", "ad team", "moderator"];

  // Only check subscription if user is not a special role
  if (!specialRoles.includes(role || "")) {
    const subRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/purchase/${email}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!subRes.ok) {
      redirect("/subscription");
    }

    const subscription = await subRes.json();

    if (subscription[0]?.status !== "Active") {
      redirect("/subscription");
    }
  }

  // Authorized: render layout
  return (
    <div className={`${bricolage.className} flash-reports`}>
      <DownloadAllButton />
      <Header />
      <FlashReportsHome />
      {children}
      <ReportsFooter />
    </div>
  );
}

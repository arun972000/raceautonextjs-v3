import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AddBootstrap from "@/components/BootstrapClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import GoogleAdsense from "./GoogleAdsense";

async function fetchLogoData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/general-settings/logo`,
      {
        cache: "no-store",
      }
    );
    const logoData = await response.json();
    const faviconUrl = logoData[0]?.favicon || "/default-favicon.ico"; // Fallback
    const logoUrl = logoData[0]?.logo || "/default-logo.png"; // Fallback
    return { faviconUrl, logoUrl };
  } catch (error) {
    console.error("Error fetching logo or favicon:", error);
    return { faviconUrl: "/default-favicon.ico", logoUrl: "/default-logo.png" };
  }
}

// Define metadata dynamically with fetched data
export async function generateMetadata(): Promise<Metadata> {
  const { faviconUrl, logoUrl } = await fetchLogoData();

  return {
    title: {
      default: "Race Auto India - Latest News on Cars, Bikes, and Commercial Vehicles",
      template: "%s - Race Auto India",
    },
    description:
      "Stay updated with the latest news and updates on cars, bikes, and commercial vehicles in India. Explore reviews, launches, and more.",
    keywords: [
      "cars",
      "bikes",
      "commercial vehicles",
      "automotive news",
      "car reviews",
      "bike reviews",
      "vehicle launches",
      "Race Auto India",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title:
        "Race Auto India - Latest News on Cars, Bikes, and Commercial Vehicles",
      description:
        "Stay updated with the latest news and updates on cars, bikes, and commercial vehicles in India. Explore reviews, launches, and more.",
      url: "https://raceautoindia.com/",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${logoUrl}`,
          width: 1200,
          height: 630,
          alt: "Race Auto India - Latest News on Cars, Bikes, and Commercial Vehicles",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Race Auto India - Latest News on Cars, Bikes, and Commercial Vehicles",
      description:
        "Stay updated with the latest news and updates on cars, bikes, and commercial vehicles in India. Explore reviews, launches, and more.",
      site: "@raceautoindia",
      images: [`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${logoUrl}`],
    },
    alternates: {
      canonical: "https://raceautoindia.com/",
    },
    other: {
      MetaKeywords: "cars, bikes, commercial vehicles, automotive news",
      MetaDescription:
        "Stay updated with the latest news and updates on cars, bikes, and commercial vehicles in India. Explore reviews, launches, and more.",
    },
    icons: [
      {
        url: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${faviconUrl}`, // Correct property is 'url' instead of 'href'
        rel: "icon",
        type: "image/x-icon",
      },
    ],
  
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="google-adsense-account" content="ca-pub-5751151754746971"/>
        <link rel="preconnect" href="https://cdn.raceautoindia.com" />
        <link
          rel="dns-prefetch"
          href="https://cdn.raceautoindia.com"
        />
      </head>
      <body>
        <AddBootstrap />
        <ToastContainer />
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-SF0F8Y7GZ6" />
      {/* <GoogleAdsense/> */}
    </html>
  );
}

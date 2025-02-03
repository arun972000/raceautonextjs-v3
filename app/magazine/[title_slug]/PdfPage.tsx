import React from "react";
import Test from "./FlipBook";


async function incrementPageView(pageUrl: string) {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/magazine/pageincrement/${pageUrl}`,
      {
        method: "PUT",
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Error incrementing page view:", error);
  }
}

const PdfPage = async ({ title }: { title: string }) => {
  await incrementPageView(title);
  return <Test />;
};

export default PdfPage;

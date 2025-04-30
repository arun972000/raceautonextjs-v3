"use client";
import { useEffect } from "react";

const AdHomeBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);
  return (
    <>
      <p
        style={{ width: "100%", background: "black" }}
        className="m-0 p-0 text-center text-white"
      >
        Advertisement
      </p>

      <div style={{ display: "block", margin: "20px 0" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-5751151754746971"
          data-ad-slot="2787988439"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
          }}
        />
      </div>
      <p
        style={{ width: "100%", background: "black" }}
        className="m-0 p-0 text-center text-white"
      >
        Advertisement
      </p>
    </>
  );
};

export default AdHomeBanner;

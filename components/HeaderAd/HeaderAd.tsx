"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeaderAd = () => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

   // Hide the container if not visible
  const headerData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.BACKEND_URL}api/admin/adspace/header`
      );
      setData(res.data[0]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    headerData();
  }, []);
  return (
    <>
      {isLoading ? (
        <div>
          <Skeleton
            height={50}
            count={1}
            baseColor="#e0e7ff" // Light blue background
            highlightColor="#c7d2fe" // Slightly darker blue highlight
            className="my-4"
          />
        </div>
      ) : (
        <div
          className={isVisible ? 'my-4' : 'd-none my-4'}

          style={{ position: "relative", aspectRatio: "8.9/1", width: "100%" }}
        >
          <Image
            src={`${process.env.BACKEND_URL}${data.ad_code_728}`}
            alt="index top"
            fill
          />
          <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
        </div>
      )}
    </>
  );
};

export default HeaderAd;

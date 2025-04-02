import React from "react";

import styles from "../HomeBanner.module.css";
import FeatureCard from "../FeatureCard";
import Slider_3 from "./Slider-3";
import FeatureCard_3 from "./FeatureCard_3";
import Link from "next/link";
import Image from "next/image";

type Feature = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  image_default:string;
  created_at: any;
  featured_order: number;
  summary: string;
};

type magazineAd = {
  title: string;
  edition_name: string;
  description: string;
  thumbnail: string;
};

const HomeBanner_3 = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/features`,
    {
      cache: "no-store",
    }
  );

  const recommendedRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/recommended-news`,
    { cache: "no-store" }
  );
  const recommendedData: Feature[] = await recommendedRes.json();

  const data: Feature[] = await res.json();
  const orderedFeatures = data.sort(
    (a, b) => a.featured_order - b.featured_order
  );
  const FeatureCardData1 = orderedFeatures
    .map((item) => <FeatureCard_3 item={item} key={item.id} />)
    .slice(0, 2);

  return (
    <>
      <div className={`${styles.pc_homebanner} row mb-4 mt-4`}>
        <div className="col-lg-4">
          <div className="card" style={{ borderRadius: 0, height: "100%" }}>
          <Link href={`/post/${recommendedData[0].title_slug}`}><div
              className={`${styles.banner__hover_v3}`}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3/2",
                overflow: "hidden",
                borderRadius: "0", // Rounded corners
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                border: "1px solid #e0e0e0",
              }}
            >
              <Image
                src={
                  process.env.NEXT_PUBLIC_S3_BUCKET_URL +
                  `${recommendedData[0].image_big}`
                }
                alt={recommendedData[0].title}
                className={styles.featured__image}
                fill
                priority
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1200px) 40vw, 25vw"
                style={{ objectFit: "cover" }} // Ensure the image covers the card
              />
            </div>
            </Link>
            <div
              className="card-body"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #ffffff, #e6e6e6, #d9d9d9)",
              }}
            >
              <h4 className="card-title mt-2">{recommendedData[0].title}</h4>
              <p className="mt-1">{recommendedData[0].summary}</p>
              {/* <Link href={`/post/${recommendedData[0].title_slug}`}>
                <button className="btn btn-primary mt-3">Read more</button>
              </Link> */}
            </div>
          </div>
        </div>
        <div className="col-lg-8 p-0">
          <div className="row m-0 p-0">
            <div className="col-12">
              <Slider_3 />
            </div>
            {/* {FeatureCardData1} */}
          </div>
        </div>
      </div>
      <div className={`${styles.mobile_homebanner} row mb-4 mt-4`}>
        <div className="col-12 p-0">
          <div className="row m-0 p-0">
            <div className="col-12">
              <Slider_3 />
            </div>
            {FeatureCardData1}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner_3;

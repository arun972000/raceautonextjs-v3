import React from "react";
import FeatureCard from "../FeatureCard";
import Slider_4 from "./Slider-4";

type Feature = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  created_at: any;
  featured_order: number;
};

const HomeBanner_4 = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/features`,
    {
      cache: "no-store",
    }
  );
  const data: Feature[] = await res.json();
  const orderedFeatures = data.sort(
    (a, b) => a.featured_order - b.featured_order
  );
  const FeatureCardData1 = orderedFeatures
    .map((item) => <FeatureCard item={item} key={item.id} />)
    .slice(0, 3);
  return (
    <>
      <div className={`row mb-4 mt-4`}>
      <div className="col-lg-9 p-0">
          <Slider_4 />
        </div>
        <div className="col-lg-3">
          <div className="row justify-content-center">{FeatureCardData1}</div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner_4;
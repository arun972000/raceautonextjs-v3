import React from "react";
import Slider_2 from "./Slider-2";
import FeatureCard_2 from "./FeaturedCard-2";
import styles from "../HomeBanner.module.css";
import SliderMobile from "../SliderMobile";

type Feature = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  created_at: any;
  featured_order: number;
};

const HomeBanner_2 = async () => {
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
    .map((item) => <FeatureCard_2 item={item} key={item.id} />)
    .slice(0, 1);
  const FeatureCardData2 = orderedFeatures
    .map((item) => (
      <div className="col-md-6 col-lg-3" key={item.id}>
        <FeatureCard_2 item={item} key={item.id} />
      </div>
    ))
    .slice(1, 5);

  return (
    <>
      <div className={`${styles.pc_homebanner} row mb-4 mt-3`}>
        <div className="col-lg-9">
          <Slider_2 />
        </div>
        <div className="col-lg-3">{FeatureCardData1}</div>
      </div>
      <div className={`${styles.pc_homebanner} row mt-3`}>
        {FeatureCardData2}
      </div>
      <div className={`${styles.mobile_homebanner} row mb-4 mt-4`}>
        <div className="col-12 p-0">
          <div className="row m-0 p-0">
            <div className="col-12">
              <SliderMobile />
            </div>
            {/* {FeatureCardData1} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner_2;

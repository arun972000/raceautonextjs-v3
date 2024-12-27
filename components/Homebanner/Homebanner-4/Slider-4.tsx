import React from "react";
import SwiperSlide_4 from "./Swiperslide-4";

type SliderType = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  slider_order: number;
};

const Slider_4 = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/slider`,
    {
      cache: "no-store",
    }
  );
  const slides: SliderType[] = await response.json();

  const sortedSlider = slides.sort((a, b) => a.slider_order - b.slider_order);

  return <SwiperSlide_4 slides={sortedSlider} />;
};

export default Slider_4;

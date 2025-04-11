import React from "react";
import Image from "next/image";

type SliderType = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  image_mid: string;
  slider_order: number;
};

const SliderMobile = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/slider`,
    {
      cache: "no-store",
    }
  );
  const slides: SliderType[] = await response.json();

  const sortedSlider = slides.sort((a, b) => a.slider_order - b.slider_order);

  return (
    <div style={{ width: "100%", position: "relative", aspectRatio: "3/2" }}>
      <Image
        src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${sortedSlider[0].image_mid}`}
        alt={sortedSlider[0].title}
        fill
        style={{ objectFit: "cover" }}
        priority
        quality={60}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 40vw"
        placeholder="blur"
        blurDataURL="/images/dummy_600x400_ffffff_cccccc (1).png"
      />
    </div>
  );
};

export default SliderMobile;

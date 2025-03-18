"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
// Adjust the import path based on your folder structure
import { Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export const MagazineSlider = () => {
  const [data, setData] = useState([]);

  const magazineApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/magazine`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    magazineApi();
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <Swiper
        direction="vertical"
        slidesPerView={2}
        spaceBetween={50}
        loop={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        style={{
          height: 660,
        }}
      >
        {data.map((item: any) => (
          <SwiperSlide key={item.id}>
            <div
              style={{
                position: "relative",
                aspectRatio: "1/1.414",
                width: "78%",
              }}
            >
              <Image
                alt={item.title}
                fill
                priority
                src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${item.image_url}`}
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, (max-width: 1200px) 40vw, 25vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

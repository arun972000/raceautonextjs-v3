"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Pagination, Autoplay } from "swiper/modules";
import { postsliderType } from "./post";
import Image from "next/image";
import { useState } from "react";
import React from "react";

type SliderType = {
  images: postsliderType[];
  title: string;
};

export default function PostSlider({ images, title }: SliderType) {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        modules={[Pagination, Autoplay]}
      >
        {images.map((item, i) => (
          <SwiperSlide key={i}>
            <ImageWithPlaceholder
              src={process.env.NEXT_PUBLIC_S3_BUCKET_URL + item.image_default}
              alt={title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

function ImageWithPlaceholder({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative", aspectRatio: "16/9" }}>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        >
          <span>Loading...</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 480px) 50vw, (max-width: 768px) 40vw, (max-width: 1200px) 60vw, 80vw"
        priority
        style={{ objectFit: "cover" }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

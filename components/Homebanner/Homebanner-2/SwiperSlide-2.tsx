"use client";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "../HomeSwiper.css";

type SliderType = {
  id: number;
  title: string;
  title_slug: string;
  image_big: string;
  image_default:string;
  slider_order: number;
  summary: string;
  created_at: any;
};

export default function SwiperSilde_2({ slides }: { slides: SliderType[] }) {
  const pagination = {
    clickable: true,
    renderBullet: function (index: any, className: any) {
      return '<span class="' + className + '"></span>';
    },
  };

  return (
    <Swiper
      grabCursor={true}
      centeredSlides={true}
      loop={true}
      autoplay={{ delay: 2000, pauseOnMouseEnter: true }} // Increase delay to reduce initial activity
      speed={600} // Faster slide transition
      slidesPerView={1}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 80,
        modifier: 1.5,
      }}
      modules={[Pagination, Autoplay]}
      style={{ marginTop: 3 }}
      pagination={pagination}
    >
      {slides.map((item) => (
        <SwiperSlide key={item.id}>
          <Link href={`/post/${item.title_slug}`}>
            <div className="row g-0" >
              <div className="col-lg-8">
                <ImageWithPlaceholder
                  src={process.env.NEXT_PUBLIC_S3_BUCKET_URL + item.image_default}
                  alt={item.title}
                />
              </div>
              <div className="col-lg-4">
                <div
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom,rgba(120, 117, 117, 0.97),rgba(90, 81, 81, 0.97))",
                    color: "white",
                    height: "100%",
                  }}
                >
                  <h4 className="mb-1 p-3">{item.title}</h4>
                  <h6 className="mb-1 p-3">{item.summary}</h6>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function ImageWithPlaceholder({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ width: "100%", position: "relative", aspectRatio: "16/9" }}>
      {loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        >
          <Skeleton
            height={50}
            count={1}
            baseColor="#e0e7ff" // Light blue background
            highlightColor="#c7d2fe" // Slightly darker blue highlight
            className="my-4"
          />
          {/* Replace this with any custom placeholder component, e.g., a spinner */}
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        priority
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}

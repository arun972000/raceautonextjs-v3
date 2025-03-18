"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import MagazineCard_v2 from "@/app/magazine/MagazineCard-v2";
import { Card } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

export type magazineCardType = {
  id: number;
  image_url: string;
  title: string;
  title_slug: string;
  keywords: string;
  created_date: any;
};

const MagazineAd_2 = () => {
  const [data, setData] = useState([]);
  const fetchMagazineAd = async () => {
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
    fetchMagazineAd();
  }, []);

  return (
    <>
      <h2 className="my-4 mt-5" style={{ fontWeight: 700 }}>
        Race Auto India Magazine
      </h2>
      <p className="mb-5">
        Explore the forefront of the automotive industry with our latest
        edition. Featuring in-depth vehicle reviews, the latest trends, and
        expert insights, we bring you everything you need to stay connected and
        informed.
      </p>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="mySwiper"
        breakpoints={{
          // When the viewport is >= 0px (mobile devices)
          0: {
            slidesPerView: 1, // Show 1 slide
            spaceBetween: 10, // Adjust space if needed
          },
          // When the viewport is >= 768px (tablets and larger devices)
          768: {
            slidesPerView: 2, // Show 2 slides
            spaceBetween: 20,
          },
          // When the viewport is >= 1024px (desktop devices)
          1024: {
            slidesPerView: 4, // Show 3 slides
            spaceBetween: 30,
          },
        }}
      >
        {data
          .map((item: magazineCardType) => (
            <SwiperSlide key={item.id}>
              <Card className="mx-3">
                <Link href={`/magazine/${item.title_slug}`}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "1/1.414",
                      width: "100%",
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
                </Link>
              </Card>
            </SwiperSlide>
          ))
          .slice(0, 5)}
      </Swiper>
    </>
  );
};

export default MagazineAd_2;

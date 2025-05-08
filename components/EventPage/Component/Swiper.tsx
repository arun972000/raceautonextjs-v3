"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import axios from "axios";
import "./eventpage.css";

const EventSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/event`
        );
        const events = response.data;

        const eventImages = events
          .map((event: any) => event.image_url)
          .filter((img: string) => !!img);

        setImages(eventImages);
        setSwiperReady(true); // Trigger swiper after images are ready
      } catch (error) {
        console.error("Error fetching event images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ marginBottom: "10px" }}>
      {swiperReady && images.length > 0 && (
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          spaceBetween={10}
          loop={true}
          centeredSlides={true}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            setActiveIndex(swiper.realIndex);
            // Force autoplay start after short delay
            setTimeout(() => {
              swiper?.autoplay?.start?.();
            }, 100);
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {images.slice(0, 4).map((src, index) => (
            <SwiperSlide key={index}>
              <div
                className={`slide-wrapper ${
                  index === activeIndex ? "active-slide" : "grayscale-slide"
                }`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${src}`}
                  fill
                  alt={`slide-${index}`}
                  className="img-fluid"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default EventSwiper;

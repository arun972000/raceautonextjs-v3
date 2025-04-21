'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import axios from 'axios';
import './eventpage.css';

const EventSwiper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/event`);
        const events = response.data;

        const eventImages = events
          .map((event: any) => event.image_url)
          .filter((img: string) => !!img);

        setImages(eventImages);
      } catch (error) {
        console.error('Error fetching event images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ marginBottom: '10px' }}>
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
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {images.slice(0, 10).map((src, index) => (
          <SwiperSlide key={index}>
            <div
              className={`slide-wrapper ${index === activeIndex ? 'active-slide' : 'grayscale-slide'}`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${src}`}
                fill
                alt={`slide-${index}`}
                className="img-fluid"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EventSwiper;

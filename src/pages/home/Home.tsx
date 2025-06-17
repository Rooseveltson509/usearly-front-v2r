// src/pages/Home.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// @ts-ignore
import "swiper/css/bundle";


import "./Home.scss";

const slides = [
  { id: 1, title: "Bienvenue sur Usearly", description: "Partagez vos retours simplement." },
  { id: 2, title: "Signalez un bug", description: "Capturez et envoyez facilement." },
  { id: 3, title: "Vos idées comptent", description: "Exprimez vos suggestions." },
];

const Home = () => {
  return (
    <div className="home-page">
      <h1 className="home-title">Accueil</h1>

      <Swiper
        className="home-swiper"
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;

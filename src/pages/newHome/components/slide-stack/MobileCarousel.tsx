import { useEffect, useRef, useState } from "react";

type SlideType = "cdc" | "suggestion" | "report";

type Slide = {
  src: string;
  type: SlideType;
};

type Props = {
  slides: Slide[];
  onSlideChange: (type: SlideType) => void;
};

const AUTO_DELAY = 5000;

export default function MobileCarousel({ slides, onSlideChange }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔁 AUTO SLIDE
  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [currentIndex]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      next();
    }, AUTO_DELAY);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(nextIndex);
    onSlideChange(slides[nextIndex].type);
  };

  const prev = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(prevIndex);
    onSlideChange(slides[prevIndex].type);
  };

  return (
    <div className="mobile-carousel-premium">
      {/* WRAPPER SLIDES */}
      <div className="carousel-track-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide.src} alt="" />
            </div>
          ))}
        </div>
      </div>
      {/* Arrows INSIDE wrapper */}
      <button className="carousel-arrow left" onClick={prev}>
        ‹
      </button>

      <button className="carousel-arrow right" onClick={next}>
        ›
      </button>

      {/* Dots OUTSIDE wrapper */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              setCurrentIndex(index);
              onSlideChange(slides[index].type);
            }}
          />
        ))}
      </div>
    </div>
  );
}

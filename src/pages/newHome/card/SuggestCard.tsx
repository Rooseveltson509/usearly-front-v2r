import React, { useState } from "react";
import "./SuggestCard.scss";
import suggestHead from "/assets/icons/suggest-head.svg";
import suggest1 from "/assets/tmp/suggest1.png";
import suggest2 from "/assets/tmp/suggest2.png";
import { useNavigate } from "react-router-dom";

const SuggestCard: React.FC = () => {
  const slides = [
    [suggest1, suggest2],
    [suggest2, suggest1],
    [suggest1, suggest2],
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  // 100 / 3 = 33.333…
  const slideWidth = 100 / slides.length;
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/feedback");
  };
  return (
    <div className="suggest-card">
      <div className="suggest-title">
        Les suggestions qui font rêver !
        <img src={suggestHead} alt="suggestHead" />
      </div>

      <div className="suggest-main">
        <div
          className="suggest-slider"
          style={{
            width: `${slides.length * 100}%`, // 300 %
            transform: `translateX(-${currentSlide * slideWidth}%)`, // -0, -33.333, -66.666
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="suggest-slide"
              style={{ width: `${slideWidth}%` }} // 33.333 %
            >
              <img src={slide[0]} alt={`suggest-${i}-1`} />
              <img src={slide[1]} alt={`suggest-${i}-2`} />
            </div>
          ))}
        </div>
      </div>

      <div className="suggest-footer">
        <button className="suggest-btn" onClick={handleButtonClick}>
          En voir plus
        </button>
        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot ${currentSlide === i ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestCard;

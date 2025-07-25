import React, { useState } from "react";
import "./CdcCard.scss";
import HeartHead from "/assets/icons/heart-head.svg";
import profile1 from "/assets/tmp/profile1.jpg";
import brand1 from "/assets/tmp/brand1.png";
import profile2 from "/assets/tmp/profile2.jpg";
import brand2 from "/assets/tmp/brand2.png";
import { useNavigate } from "react-router-dom";

const CdcCard: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    { id: 1, title: "Gros crush pour l'app", profile: profile1, brand: brand1 },
    { id: 2, title: "Vibes de love pour...", profile: profile2, brand: brand2 },
    { id: 3, title: "Incroyable", profile: profile1, brand: brand1 },
    { id: 4, title: "Coup de coeur", profile: profile2, brand: brand2 },
  ];

  const handleSlideClick = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/feedback");
  };
  return (
    <div className="cdc-card">
      <div className="cdc-title">
        <h2>
          Les coups de <img src={HeartHead} alt="HeartHead" /> que vous avez
          plus aimés !
        </h2>
      </div>
      <div className="cdc-main">
        <div
          className="cdc-main-slider"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {cards.map((card) => (
            <div key={card.id} className="cdc-main-content">
              <div className="cdc-main-title">{card.title}</div>
              <div className="cdc-main-img">
                <img src={card.profile} alt={`profile${card.id}`} />
                <img src={card.brand} alt={`brand${card.id}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cdc-footer">
        <button className="cdc-btn" onClick={handleButtonClick}>
          Découvrir
        </button>
        <div className="slider-dots">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => handleSlideClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CdcCard;

import React, { useState } from "react";
import "./CdcCard.scss";
import HeartHead from "/assets/icons/heart-head.svg";
import profile1 from "/assets/tmp/profile1.jpg";
import brand1 from "/assets/tmp/brand1.png";
import profile2 from "/assets/tmp/profile2.jpg";
import brand2 from "/assets/tmp/brand2.png";
import { useNavigate } from "react-router-dom";
import DoubleProfilePicture from "@src/components/commons/doubleProfilePicture/DoubleProfilePicture";
import Button from "@src/components/buttons/Buttons";
import SliderDots from "@src/components/shared/sliderDots/sliderDots";
import { useAuth } from "@src/services/AuthContext";

const CdcCard: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isAuthenticated } = useAuth();

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
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/feedback");
  };
  return (
    <div className="cdc-card">
      <div className="cdc-title">
        <h2>
          Les coups{" "}
          <span className="no-break">
            de
            <img src={HeartHead} alt="HeartHead" />
          </span>{" "}
          que vous avez plus aimés !
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
              <DoubleProfilePicture
                UserPicture={card.profile}
                BrandPicture={card.brand}
                pseudoVisible={false}
                sizeHW={80}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="cdc-footer">
        <Button
          addClassName="cdc-btn"
          title="Découvrir"
          onClick={handleButtonClick}
        />
        <SliderDots
          count={3}
          current={currentSlide}
          onChange={handleSlideClick}
        />
      </div>
    </div>
  );
};

export default CdcCard;

import React, { useState } from "react";
import "./SignalCard.scss";
import signalHead from "/assets/icons/signal-head.svg";
import signal1 from "/assets/tmp/signal1.png";
import signal2 from "/assets/tmp/signal2.png";
import signal3 from "/assets/tmp/signal1.png";
import signal4 from "/assets/tmp/signal2.png";
import { useNavigate } from "react-router-dom";
import SignalementPostMinimal from "@src/components/commons/signalements/SignalementPostMinimal";
import Buttons from "@src/components/buttons/Buttons";
import SliderDots from "@src/components/shared/sliderDots/sliderDots";
import { useAuth } from "@src/services/AuthContext";

const SignalCard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [signal1, signal2, signal3, signal4];
  const visibleCount = 2;
  const totalSteps = images.length - visibleCount + 1;

  // Décalage = 100 / nombre d'images (25 % pour 4 images)
  const step = 100 / images.length;

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/feedback");
  };

  return (
    <div className="signal-card">
      <div className="signal-title">
        Les signalements qui ont le plus fait râler cette semaine
        <img src={signalHead} alt="signalHead" />
      </div>

      <div className="signal-content">
        <div className="signal-main">
          <div
            className="signal-slider"
            style={{ transform: `translateY(-${currentSlide * step}%)` }}
          >
            <div className="signal-slide">
              <SignalementPostMinimal />
              <SignalementPostMinimal />
              <SignalementPostMinimal />
              <SignalementPostMinimal />
            </div>
          </div>
        </div>
        <SliderDots
          count={totalSteps}
          current={currentSlide}
          onChange={setCurrentSlide}
          orientation="vertical"
        />
      </div>

      <Buttons
        addClassName="signal-btn"
        title="Découvrir"
        onClick={handleButtonClick}
      />
    </div>
  );
};

export default SignalCard;

import React, { useState } from "react";
import "./SignalCard.scss";
import signalHead from "../../../assets/icons/signal-head.svg";
import signal1 from "../../../assets/tmp/signal1.png";
import signal2 from "../../../assets/tmp/signal2.png";
import signal3 from "../../../assets/tmp/signal1.png";
import signal4 from "../../../assets/tmp/signal2.png";
import { useNavigate } from "react-router-dom";

const SignalCard: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [signal1, signal2, signal3, signal4];
  const visibleCount = 2;
  const totalSteps = images.length - visibleCount + 1;

  // Décalage = 100 / nombre d'images (25 % pour 4 images)
  const step = 100 / images.length;

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
            {images.map((img, i) => (
              <div className="signal-slide" key={i}>
                <img src={img} alt={`signal-${i}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="slider-dots-vertical">
          {[...Array(totalSteps)].map((_, i) => (
            <button
              key={i}
              className={`dot ${currentSlide === i ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <button className="signal-btn" onClick={() => navigate("/feedback")}>
        Découvrir
      </button>
    </div>
  );
};

export default SignalCard;

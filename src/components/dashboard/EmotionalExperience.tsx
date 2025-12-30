import { ChevronDown, ChevronRight } from "lucide-react";

import "./FeedbackSection.scss";

const EmotionalExperience = () => {
  return (
    <>
      <div className="emotion-card">
        <div className="emotion-card__overlay" />

        <div className="emotion-card__top">
          <h3 className="emotion-card__title">Expérience émotionnelle</h3>
          <button className="emotion-card__next" aria-label="Suivant">
            <ChevronRight size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="emotion-card__body">
          <div className="emotion-card__content">
            <div className="emotion-card__cloud">
              <span>😍</span>
              <span>🤒</span>
              <span>😤</span>
              <span>❤️</span>
              <span>👍</span>
              <span>😠</span>
              <span>😣</span>
              <span>😡</span>
              <span>😐</span>
            </div>

            <div className="emotion-card__stats">
              <div className="emotion-card__stat-box">
                <div className="emotion-card__stat-value">244</div>
                <div className="emotion-card__stat-label">Emotions</div>
              </div>
              <div className="emotion-card__stat-box">
                <div className="emotion-card__stat-value">3</div>
                <div className="emotion-card__stat-label">Zones critiques</div>
              </div>
            </div>
          </div>
        </div>

        <div className="emotion-card__row">
          <div className="emotion-card__legend-line">
            <span className="legend-chip">
              <span className="legend-emoji">😡</span>
              <span className="legend-label">Négative 50%</span>
            </span>
            <span className="legend-chip">
              <span className="legend-emoji">😊</span>
              <span className="legend-label">Positive 27%</span>
            </span>
            <span className="legend-chip">
              <span className="legend-emoji">😐</span>
              <span className="legend-label">Neutre 13%</span>
            </span>
          </div>
          <ChevronDown size={16} className="emotion-card__chevron" />
        </div>

        <div className="emotion-card__row">
          <div className="emotion-card__legend-line">
            <span className="legend-chip legend-chip--alert">Paiement 🔥</span>
            <span className="legend-sep">→</span>
            <span className="legend-chip legend-chip--alert">Recherche ⚠️</span>
            <span className="legend-sep">→</span>
            <span className="legend-chip legend-chip--alert">Livraison ⚠️</span>
          </div>
          <ChevronDown size={16} className="emotion-card__chevron" />
        </div>
      </div>
      <div className="feedback-card__footer">
        <div className="feedback-card__speech">
          <span className="feedback-card__speech-text">Frustré</span>
        </div>
        <span
          className="feedback-card__speech-emoji"
          role="img"
          aria-label="Emoji frustré"
        >
          😡
        </span>
      </div>
    </>
  );
};

export default EmotionalExperience;

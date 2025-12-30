import { Sparkles, Star, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import "./SuggestionCrush.scss";

import suggestionContentImg from "/assets/icons/dashboard/suggestionContentImg.svg";
import etoileSuggestionOnBar from "/assets/icons/dashboard/etoileSuggestionOnBar.svg";

const suggestionProgress = 24;

const SuggestionCard = () => (
  <div className="suggestion-card">
    <div className="suggestion-heading">
      <div className="suggestion-heading__text">
        <h3 className="suggestion-title">La suggestion qui fait le buzz !</h3>
        <p className="suggestion-subtitle">Les Usears inspirent ta roadmap.</p>
      </div>
      <div className="spark-stack" aria-hidden="true">
        <Sparkles size={22} />
        <Star size={18} className="spark-star" />
      </div>
    </div>

    <div className="buzz-card-shell">
      <div className="buzz-idea">
        <img src={suggestionContentImg} alt="content suggestion card" />
      </div>

      <div className="buzz-details">
        <div className="buzz-user">
          <div className="buzz-user-info">
            <div className="buzz-username">
              <span className="name">Camille</span>
              <span className="sep">X</span>
              <span className="brand">Netflix</span>
            </div>
            <span className="meta-time">- 39 min</span>
          </div>

          <div className="buzz-user-badges">
            <img
              src="/assets/images/p4.png"
              alt="Camille"
              className="buzz-avatar"
            />
            <div className="buzz-brand-mark">N</div>
          </div>
        </div>

        <div className="buzz-title-line">
          Le bouton « Favori des Favoris » !
        </div>
        <p className="buzz-desc">
          Une idée simple, mais qui changerait la vie des binge-watchers...
          <button className="link-more" type="button">
            Voir plus
          </button>
        </p>

        <div className="buzz-progress">
          <div className="buzz-progress-rail">
            <div
              className="buzz-progress-fill"
              style={{ width: `${suggestionProgress}%` }}
            />
            <div
              className="buzz-progress-spark"
              style={{ left: `${suggestionProgress}%` }}
            >
              <img src={etoileSuggestionOnBar} alt="star suggest" />
            </div>
            <span className="buzz-progress-label">J-21</span>
          </div>
          <span className="buzz-progress-value">{suggestionProgress}%</span>
        </div>

        <div className="buzz-reactions">
          <hr />
          <div className="reaction-bubble">
            <ThumbsUp size={16} />
            <MessageCircle size={16} />
            <Share2 size={16} />
          </div>
        </div>
      </div>
    </div>

    <button className="pill-cta suggestion-cta">Ajouter à la roadmap</button>
  </div>
);

export default SuggestionCard;

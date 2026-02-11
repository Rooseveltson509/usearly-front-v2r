import { Link } from "react-router-dom";
import visage from "/assets/icons/out.gif";
import visageFallback from "/assets/icons/visageError.svg";
import "./NotFoundPage.scss";

export default function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-page-container">
        <div className="error-text-container">
          <div className="error-text-container-message">
            <div className="error-animated-text">
              <span className="line line-1">Oups !</span>
              <span className="line line-2">
                Il semblerait que cette page n'existe pas !
              </span>
            </div>
          </div>
          <div className="error-text-container-button">
            <Link to="/">Retourner à l'accueil</Link>
          </div>
        </div>
        <div className="error-error-container">
          <h2 className="error-error-container-error">
            <span className="error-gif-slot number-slot" aria-hidden="true">
              4
            </span>
            <span className="error-gif-slot" aria-hidden="true">
              <picture>
                <img
                  className="error-face"
                  src={visage}
                  width={200}
                  height={200}
                  decoding="async"
                  loading="eager"
                  alt="Visage erreur animé"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = visageFallback;
                  }}
                />
              </picture>
            </span>
            <span className="error-gif-slot number-slot" aria-hidden="true">
              4
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
}

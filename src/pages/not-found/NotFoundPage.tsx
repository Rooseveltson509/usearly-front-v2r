import "./NotFoundPage.scss";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="notfound-page">
      <div className="notfound-illustration">
        <svg
          width="220"
          height="200"
          viewBox="0 0 220 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ombre */}
          <ellipse cx="110" cy="185" rx="50" ry="10" fill="rgba(0,0,0,0.08)" />

          {/* Bulle + U */}
          <g transform="translate(50,30)">
            <rect
              x="0"
              y="0"
              width="120"
              height="120"
              rx="28"
              fill="#fff"
              stroke="#000"
              strokeWidth="6"
            />
            <path
              d="M40 120 L60 140 L60 120"
              fill="#fff"
              stroke="#000"
              strokeWidth="6"
            />
            <path
              d="M50 40 v30 a20 20 0 0 0 40 0 v-30"
              stroke="#000"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* LOUPE ANIMÉE */}
          <g className="magnifier" transform="translate(150,110)">
            <circle
              cx="0"
              cy="0"
              r="22"
              stroke="#000"
              strokeWidth="6"
              fill="none"
            />
            <line
              className="handle"
              x1="16"
              y1="16"
              x2="34"
              y2="34"
              stroke="#000"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <h1>Page introuvable</h1>

      <p>
        On dirait que cette page n’existe pas… Notre assistant est en train de
        la chercher 👀
      </p>

      <Link to="/home" className="notfound-button">
        Retour à l’accueil
      </Link>
    </div>
  );
}

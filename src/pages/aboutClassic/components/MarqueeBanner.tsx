import emojiTransparentTeteCoeur from "/assets/icons/emojiTransparentTeteCoeur.svg";

const MARQUEE_ITEMS = Array.from({ length: 4 });

const MarqueeBanner = () => (
  <div
    className="about-classic__outline-banner"
    aria-label="Usearly porte-parole des utilisateurs"
  >
    <div className="about-classic__marquee">
      <div className="about-classic__marquee-track" aria-hidden="true">
        <div className="about-classic__marquee-group">
          {MARQUEE_ITEMS.map((_, index) => (
            <span className="about-classic__marquee-item Raleway" key={index}>
              Usearly porte-parole des utilisateurs
              <img src={emojiTransparentTeteCoeur} alt="" />
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default MarqueeBanner;

import emojiTransparentTeteCoeur from "/assets/icons/emojiTransparentTeteCoeur.svg";

const ManifestoSection = () => (
  <div className="about-classic__manifesto">
    <p className="Raleway">
      Usearly, c’est la force du collectif qui permet à chacun que ses retours
      soient entendus et aient un impact{" "}
      <span className="about-classic__manifesto-nowrap">
        réel.
        <img
          className="about-classic__inline-icon"
          src={emojiTransparentTeteCoeur}
          alt="Tête emoji coeur aux yeux"
          aria-hidden="true"
        />
      </span>
    </p>
    <p className="about-classic__manifesto-highlight Raleway">
      Usearly, c'est un porte-parole. <br />
      Pour améliorer chaque expérience. <br />
      Ensemble.
    </p>
  </div>
);

export default ManifestoSection;

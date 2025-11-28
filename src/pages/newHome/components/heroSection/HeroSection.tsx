import TypingFullWord from "../typing-text/TypingWords";
import "./HeroSection.scss";
import MouseRevealImages from "./MouseRevealImages";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">
        AMÉLIORER <br />
        L’EXPÉRIENCE <br />
        <TypingFullWord
          words={[
            "ENSEMBLE",
            "DIGITAL",
            "UTILISATEUR",
            "CLIENT",
            "ÉMOTIONNELLE",
          ]}
        />
      </h1>

      <MouseRevealImages
        images={[
          "/assets/images/p1.png",
          "/assets/images/p2.png",
          "/assets/images/p3.png",
          "/assets/images/p4.png",
          "/assets/images/p5.png",
          "/assets/images/p6.png",
        ]}
      />
    </section>
  );
};

export default HeroSection;

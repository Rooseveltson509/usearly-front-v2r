import TypingFullWord from "../typing-text/TypingWords";
import "./HeroSection.scss";
//import MouseRevealImages from "./MouseRevealImages";
import MouseTrail from "./MouseTrail";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">
        <span className="title-top">AMÉLIORER</span> <br />
        <span className="title-bottom">L’EXPÉRIENCE</span> <br />
        <TypingFullWord
          words={[
            "ENSEMBLE",
            "DIGITALE",
            "UTILISATEUR",
            "CLIENT",
            "ÉMOTIONNELLE",
          ]}
        />
      </h1>

      <MouseTrail
        images={[
          "/assets/images/p1.png",
          "/assets/images/p2.png",
          "/assets/images/p3.png",
          "/assets/images/p4.png",
          "/assets/images/p5.png",
          "/assets/images/p6.png",
          "/assets/images/p7.png",
          "/assets/images/p8.png",
          "/assets/images/p9.png",
          "/assets/images/p10.png",
          "/assets/images/p11.png",
          "/assets/images/p12.png",
        ]}
      />
    </section>
  );
};

export default HeroSection;

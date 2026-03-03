import React, { useRef } from "react";
import "./NewHomeAlternatif.scss";
/* import SuggestCard from "./card/SuggestCard"; */
import BrandCard from "./card/BrandCard";
import Footer from "@src/components/layout/Footer";
// import VideoContainerLanding from "./components/videoContainer/videoContainerLanding";
import TitleSection from "@src/pages/aboutClassic/components/TitleSection";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
import UsearlyDrawing from "@src/components/background/Usearly";
import Hero from "@src/pages/aboutClassic/components/Hero";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";
import FavoriteSection from "./components/slide-stack/FavoriteSection";
import InfiniteCarouselBanner from "./components/infiniteCarouselBanner/InfiniteCarouselBanner";
// import useScrollPhrase from "./hooks/useScrollPhrase";
import useScrollPhrase from "@src/pages/aboutClassic/hooks/useScrollPhrase";
import ExtensionRedirect from "@src/components/extension-redirect/ExtensionRedirect";

const PHRASES = ["des sondages", "des chatbots", "le silence"];
const SCROLL_STEP = 0.05;

const NewHome: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);
  return (
    <div className="new-home-page">
      <Hero />
      <TitleSection phrase={PHRASES[phraseIndex]} />

      {/* --- SECTION NORMALE --- */}
      <div className="new-home-main" ref={sectionRef}>
        <ExtensionExample />

        <InfiniteCarouselBanner />

        <ExtensionRedirect />

        <div className="scroll-section">
          <ScrollInlineImages
            lines={[
              "NOUS CONNECTONS",
              "LES UTILISATEURS",
              "AUX MARQUES POUR CRÉER ENSEMBLE",
              "DES EXPÉRIENCES POSITIVES.",
            ]}
            images={[
              { line: 1, wordIndex: 1, src: "/assets/images/txt1.png" },
              { line: 3, wordIndex: 2, src: "/assets/images/txt2.png" },
              {
                line: 2,
                wordIndex: 2,
                src: "/assets/images/txt3.png",
                rotate: true,
              },
            ]}
          />
        </div>
      </div>
      <div className="favorite-isolated">
        <FavoriteSection />
      </div>

      {/* --- SUITE DU CONTENU (NON AFFECTÉ) --- */}
      <div className="new-home-main">
        {/* <SuggestCard /> */}
        <BrandCard />
        <div className="usearly-drawing-container">
          <UsearlyDrawing animationDuration="25" />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default NewHome;

import React from "react";
import "./NewHome.scss";
/* import SuggestCard from "./card/SuggestCard"; */
import BrandCard from "./card/BrandCard";
import Footer from "@src/components/layout/Footer";
import VideoContainerLanding from "./components/videoContainer/videoContainerLanding";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
import UsearlyDrawing from "@src/components/background/Usearly";
import HeroSection from "./components/heroSection/HeroSection";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";
import FavoriteSection from "./components/slide-stack/FavoriteSection";

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <HeroSection />

      {/* --- SECTION NORMALE --- */}
      <div className="new-home-main">
        <VideoContainerLanding />
        <ExtensionExample />

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
              { line: 2, wordIndex: 3, src: "/assets/images/txt2.png" },
              {
                line: 3,
                wordIndex: 1,
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
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default NewHome;

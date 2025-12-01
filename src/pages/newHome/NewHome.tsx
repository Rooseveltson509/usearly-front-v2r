import React from "react";
import "./NewHome.scss";
import SignalCard from "./card/SignalCard";
import CdcCard from "./card/CdcCard";
import SuggestCard from "./card/SuggestCard";
import BrandCard from "./card/BrandCard";
import Footer from "@src/components/layout/Footer";
import VideoContainerLanding from "./components/videoContainer/videoContainerLanding";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
import UsearlyDrawing from "@src/components/background/Usearly";
import HeroSection from "./components/heroSection/HeroSection";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <HeroSection />
      <div className="new-home-main">
        <VideoContainerLanding />
        <ExtensionExample />

        {/* WRAPPER ICI */}
        <div className="scroll-section">
          <ScrollInlineImages
            lines={[
              "NOUS CONNECTONS",
              "LES UTILISATEURS",
              "AUX MARQUES POUR CRÉER ENSEMBLE",
              "DES EXPÉRIENCES POSITIVES.",
            ]}
            images={[
              /*               { line: 0, wordIndex: 1, src: "/assets/images/p7.jpg" }, */
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

        <div className="new-home-main-top">
          <SignalCard />
          <CdcCard />
        </div>

        <SuggestCard />
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

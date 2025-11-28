import React from "react";
import "./NewHome.scss";
import SignalCard from "./card/SignalCard";
import CdcCard from "./card/CdcCard";
import SuggestCard from "./card/SuggestCard";
import BrandCard from "./card/BrandCard";
import Footer from "@src/components/layout/Footer";
import VideoContainerLanding from "./components/videoContainer/videoContainerLanding";
import PurpleBannerLanding from "../home/components/purpleBanner/PurpleBannerLanding";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
import UsearlyDrawing from "@src/components/background/Usearly";
import HeroSection from "./components/heroSection/HeroSection";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <HeroSection />
      <PurpleBannerLanding navOn={false} />

      <div className="new-home-main">
        <VideoContainerLanding />
        <ExtensionExample />

        {/* WRAPPER ICI */}
        <div className="scroll-section">
          <ScrollInlineImages
            lines={[
              "DANS UN MONDE DE BRUIT,",
              "NOUS AIDONS LES À SE",
              "DISTINGUER AVEC DES IDÉES CLAIRES",
              "ET UN DESIGN QUI LAISSE UNE EMPREINTE.",
            ]}
            images={[
              { line: 0, wordIndex: 4, src: "/assets/images/p1.png" },
              { line: 1, wordIndex: 3, src: "/assets/images/p2.png" },
              { line: 2, wordIndex: 2, src: "/assets/images/p3.png" },
              { line: 3, wordIndex: 1, src: "/assets/images/p4.png" },
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

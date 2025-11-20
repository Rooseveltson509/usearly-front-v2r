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

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <PurpleBannerLanding navOn={false} />
      <div className="new-home-main">
        <VideoContainerLanding />
        <ExtensionExample />
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

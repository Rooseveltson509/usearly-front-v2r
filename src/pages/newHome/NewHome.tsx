import React from "react";
import "./NewHome.scss";
import SignalCard from "./card/SignalCard";
import CdcCard from "./card/CdcCard";
import SuggestCard from "./card/SuggestCard";
import BrandCard from "./card/BrandCard";
import PurpleBanner from "../home/components/purpleBanner/PurpleBanner";

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <PurpleBanner navOn={false} />
      <div className="new-home-main">
        <div className="new-home-main-top">
          <SignalCard />
          <CdcCard />
        </div>
        <SuggestCard />
        <BrandCard />
      </div>
    </div>
  );
};

export default NewHome;

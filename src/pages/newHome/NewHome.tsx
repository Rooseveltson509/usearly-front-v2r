import React, { useState } from "react";
import "./NewHome.scss";
import MainTopBarHome from "./card/MainTopBarHome";
import SignalCard from "./card/SignalCard";
import CdcCard from "./card/CdcCard";
import SuggestCard from "./card/SuggestCard";
import BrandCard from "./card/BrandCard";

const NewHome: React.FC = () => {
  return (
    <div className="new-home-page">
      <MainTopBarHome />
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

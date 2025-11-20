import React from "react";
import "./BrandCard.scss";
import brandHead from "/assets/icons/brand-head.svg";
import InfiniteSlider from "../../../components/infiniteSlider/InfiniteSlider";
import Buttons from "@src/components/buttons/Buttons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@src/services/AuthContext";

const BrandCard: React.FC = () => {
  // Liste des marques
  const brands = [
    "Netflix",
    "Spotify",
    "Apple",
    "Nike",
    "Adidas",
    "Samsung",
    "Google",
    "Amazon",
    "Microsoft",
    "Tesla",
  ];

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/feedback");
  };

  return (
    <div className="brand-card">
      <div className="brand-title">
        <h2>Top marques qui se bougent cette semaine</h2>
        <img src={brandHead} alt="Brand Head" />
      </div>
      <div className="brand-main">
        <InfiniteSlider brandsArray={brands} />
      </div>
      <div className="brand-footer">
        <Buttons
          addClassName="brand-btn"
          title="En savoir plus"
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
};

export default BrandCard;

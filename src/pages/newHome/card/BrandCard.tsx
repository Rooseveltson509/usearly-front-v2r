import React, { useState, useEffect } from "react";
import "./BrandCard.scss";
import brandHead from "/assets/icons/brand-head.svg";
import { fetchValidBrandLogo } from "../../../utils/brandLogos";

const BrandCard: React.FC = () => {
  const [logos, setLogos] = useState<Record<string, string>>({});

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

  const infiniteBrands = [
    ...brands,
    ...brands,
    ...brands,
    ...brands,
    ...brands,
  ];

  // Charger les logos dynamiquement
  useEffect(() => {
    const loadBrandLogos = async () => {
      const entries = await Promise.all(
        brands.map(async (brand) => {
          const logoUrl = await fetchValidBrandLogo(brand);
          return [brand, logoUrl] as [string, string];
        }),
      );
      setLogos(Object.fromEntries(entries));
    };
    loadBrandLogos();
  }, []);

  return (
    <div className="brand-card">
      <div className="brand-title">
        <h2>Top marques qui se bougent cette semaine</h2>
        <img src={brandHead} alt="Brand Head" />
      </div>
      <div className="brand-main">
        <div className="brand-slider">
          {infiniteBrands.map((brand, index) => (
            <div key={`${brand}-${index}`} className="brand-item">
              <img
                src={logos[brand] || ""}
                alt={brand}
                className="brand-logo"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="brand-footer">
        <button className="brand-btn">En savoir plus</button>
      </div>
    </div>
  );
};

export default BrandCard;

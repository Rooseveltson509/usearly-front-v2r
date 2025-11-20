import "./InfiniteSlider.scss";
import { useEffect, useState } from "react";
import { fetchValidBrandLogo } from "../../utils/brandLogos";

type InfiniteSliderProps = {
  brandsArray: string[];
};

const InfiniteSlider = ({ brandsArray }: InfiniteSliderProps) => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  // Liste des marques
  //   const brands = [
  //     "Netflix",
  //     "Spotify",
  //     "Apple",
  //     "Nike",
  //     "Adidas",
  //     "Samsung",
  //     "Google",
  //     "Amazon",
  //     "Microsoft",
  //     "Tesla",
  //   ];

  const brands = brandsArray;

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
    <div className="brand-slider">
      {infiniteBrands.map((brand, index) => (
        <div key={`${brand}-${index}`} className="brand-item">
          <img src={logos[brand] || ""} alt={brand} className="brand-logo" />
        </div>
      ))}
    </div>
  );
};

export default InfiniteSlider;

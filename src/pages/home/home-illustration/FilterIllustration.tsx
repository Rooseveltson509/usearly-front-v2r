import hotImg from "/assets/filters-reports/hot.png";
import rageImg from "/assets/filters-reports/rage.png";
import popularImg from "/assets/filters-reports/popular.png";
import urgentImg from "/assets/filters-reports/carrying.png";
import recentImg from "/assets/filters-reports/recent.png";
import { useEffect, useState } from "react";
import {
  fetchValidBrandLogo,
  getBrandLogo,
} from "@src/utils/brandLogos";
import "./FilterIllustration.scss";

const illustrationMap = {
  default: {
    label: "Filtrez les résultats",
    emoji: "✨",
    img: recentImg, // ou une icône neutre si tu veux
  },
  chrono: {
    label: "Les plus récents",
    emoji: "📅",
    img: recentImg,
  },
  confirmed: {
    label: "Ça chauffe par ici",
    emoji: "🔥",
    img: hotImg,
  },
  rage: {
    label: "Les plus rageants",
    emoji: "😡",
    img: rageImg,
  },
  popular: {
    label: "Les plus populaires",
    emoji: "👍",
    img: popularImg,
  },
  urgent: {
    label: "À shaker vite",
    emoji: "👀",
    img: urgentImg,
  },
};

type Props = {
  filter: string;
  selectedBrand?: string;
  selectedCategory?: string;
  siteUrl?: string;
};

const FilterIllustration = ({
  filter,
  selectedBrand,
  selectedCategory,
  siteUrl,
}: Props) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLogo = async () => {
      if (selectedBrand) {
        try {
          const url = await fetchValidBrandLogo(selectedBrand, siteUrl);
          if (isMounted) setLogoUrl(url);
        } catch (e) {
          console.warn("Erreur chargement logo:", e);
          if (isMounted) setLogoUrl(getBrandLogo(selectedBrand, siteUrl));
        }
      } else {
        setLogoUrl(null);
      }
    };

    loadLogo();
    return () => {
      isMounted = false;
    };
  }, [selectedBrand, siteUrl, selectedCategory]);

  // 👉 Cas 1 : filtre marque/catégorie actif
  if (selectedBrand || selectedCategory) {
    const text =
      selectedBrand && selectedCategory
        ? `🔎 Résultats filtrés (${selectedBrand} × ${selectedCategory})`
        : `🔎 Résultats filtrés (${selectedBrand || selectedCategory})`;

    return (
      <div className="filter-illustration-sidebar filtered">
        <div className="illustration-content">
          <p>{text}</p>
          {logoUrl && (
            <div className="brand-watermark-wrapper">
              <img
                src={logoUrl}
                alt={selectedBrand || "logo"}
                className="brand-watermark"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 👉 Cas 2 : filtres globaux classiques (ou "default" si vide)
  const key = filter === "" ? "default" : (filter as keyof typeof illustrationMap);
  const data = illustrationMap[key];
  if (!data) return null;

  return (
    <div className="filter-illustration-sidebar">
      <div className="illustration-content">
        <img src={data.img} alt={data.label} />
        <p>
          {data.emoji} {data.label}
        </p>
      </div>
    </div>
  );
};

export default FilterIllustration;

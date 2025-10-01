import hotImg from "/assets/filters-reports/hot1.png";
import rageImg from "/assets/filters-reports/rage1.png";
import popularImg from "/assets/filters-reports/popular1.png";
import urgentImg from "/assets/filters-reports/carrying1.png";
import recentImg from "/assets/filters-reports/recent1.png";
import recentReportImg from "/assets/img-banner/banner-report-recent.png";

// 🎨 Ajouts spécifiques pour Coup de cœur & Suggestions
import likedImg from "/assets/img-banner/banner-cdc-pop.png";
import recentCdcImg from "/assets/img-banner/banner-cdc-recent.png";
import commentedImg from "/assets/img-banner/banner-cdc-liked.png";

import discussedImg from "/assets/img-banner/banner-suggest-liked.png";
import recentSuggestionImg from "/assets/img-banner/banner-suggest-open-vote.png";
import likedSuggestionImg from "/assets/img-banner/banner-suggestion-adopt.png";

import { useEffect, useState } from "react";
import { fetchValidBrandLogo, getBrandLogo } from "@src/utils/brandLogos";
import "./FilterIllustration.scss";

const illustrationMap = {
  // === Signalements ===
  default: {
    label: "Filtrez les résultats",
    emoji: "✨",
    img: recentImg,
  },
  chrono: {
    label: "Les plus récents",
    emoji: "📅",
    img: recentReportImg,
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

  // === Coups de cœur ===
  liked: {
    label: "Les plus aimés",
    emoji: "🥰",
    img: likedImg,
  },
  recent: {
    label: "Les plus récents",
    emoji: "🕒",
    img: recentCdcImg,
  },
  all: {
    label:
      "Simple mais génial : tu quittes un épisode, tu reprends exactement là où tu t’étais arrêté, sans perdre le fil de ton film ou ta série.",
    emoji: "🥰",
    img: likedImg,
  },
  enflammes: {
    label: "Les plus enflammés",
    emoji: "❤️‍🔥",
    img: commentedImg,
  },
  recentcdc: {
    label: "Les plus commentés",
    emoji: "💬",
    img: commentedImg,
  },

  // === Suggestions ===
  discussed: {
    label: "Les plus discutées",
    emoji: "💡",
    img: discussedImg,
  },
  recentSuggestion: {
    label:
      "Spotify est top mais j’aimerais avoir un meilleur système de tri dans mes playlists, par exemple pouvoir classer facilement par humeur ou moment de la…",
    emoji: "😎",
    img: recentSuggestionImg,
  },
  allSuggest: {
    label:
      "Spotify est top mais j’aimerais avoir un meilleur système de tri dans mes playlists, par exemple pouvoir classer facilement par humeur ou moment de la…",
    emoji: "🥱",
    img: discussedImg,
  },

  likedSuggestion: {
    label: "Les plus likés",
    emoji: "🥰",
    img: likedSuggestionImg,
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

  // 👉 Cas 2 : filtres globaux (reports, cdc, suggestions)
  const key =
    filter === "" ? "default" : (filter as keyof typeof illustrationMap);
  const data = illustrationMap[key];
  if (!data) return null;

  return (
    <div className="filter-illustration-sidebar">
      <div className="illustration-content">
        <img src={data.img} alt={data.label} />
      </div>
    </div>
  );
};

export default FilterIllustration;

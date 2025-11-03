import hotImg from "/assets/filters-reports/hot1.png";
import rageImg from "/assets/filters-reports/rage1.png";
import popularImg from "/assets/filters-reports/popular1.png";
import urgentImg from "/assets/filters-reports/carrying1.png";
import recentImg from "/assets/filters-reports/recent1.png";
import recentReportImg from "/assets/img-banner/banner-report-recent.png";

// 🎨 Coup de cœur & Suggestions
import likedImg from "/assets/img-banner/banner-cdc-pop.png";
import recentCdcImg from "/assets/img-banner/banner-cdc-recent.png";
import commentedImg from "/assets/img-banner/banner-cdc-liked.png";
import discussedImg from "/assets/img-banner/banner-suggest-liked.png";
import recentSuggestionImg from "/assets/img-banner/banner-suggest-open-vote.png";
import likedSuggestionImg from "/assets/img-banner/banner-suggestion-adopt.png";

// ✅ public/assets/brandSolo/*.png
const reportBrandSolo = "/assets/brandSolo/reportBrandSolo.png";
const cdcBrandSolo = "/assets/brandSolo/cdcBrandSolo.png";
const suggestBrandSolo = "/assets/brandSolo/suggestBrandSolo.png";

import { useEffect, useMemo } from "react";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsBigUtils";
import "./FilterIllustration.scss";

const illustrationMap = {
  // === Signalements ===
  default: { label: "Filtrez les résultats", emoji: "✨", img: recentImg },
  chrono: { label: "Les plus récents", emoji: "📅", img: recentReportImg },
  confirmed: { label: "Ça chauffe par ici", emoji: "🔥", img: hotImg },
  rage: { label: "Les plus rageants", emoji: "😡", img: rageImg },
  popular: { label: "Les plus populaires", emoji: "👍", img: popularImg },
  urgent: { label: "À shaker vite", emoji: "👀", img: urgentImg },

  // === Coups de cœur ===
  liked: { label: "Les plus aimés", emoji: "🥰", img: likedImg },
  recent: { label: "Les plus récents", emoji: "🕒", img: recentCdcImg },
  all: { label: "Simple mais génial...", emoji: "🥰", img: likedImg },
  enflammes: { label: "Les plus enflammés", emoji: "❤️‍🔥", img: commentedImg },
  recentcdc: { label: "Les plus commentés", emoji: "💬", img: commentedImg },

  // === Suggestions ===
  discussed: { label: "Les plus discutées", emoji: "💡", img: discussedImg },
  recentSuggestion: {
    label: "Spotify est top mais j’aimerais...",
    emoji: "😎",
    img: recentSuggestionImg,
  },
  allSuggest: {
    label: "Spotify est top mais j’aimerais...",
    emoji: "🥱",
    img: discussedImg,
  },
  likedSuggestion: {
    label: "Les plus likés",
    emoji: "🥰",
    img: likedSuggestionImg,
  },
};

type TabKey = "report" | "coupdecoeur" | "suggestion";

type Props = {
  filter: string;
  selectedBrand?: string;
  selectedCategory?: string;
  siteUrl?: string;
  onglet?: TabKey;
};

const filterKeysByTab: Record<TabKey, Array<keyof typeof illustrationMap>> = {
  report: ["default", "chrono", "confirmed", "rage", "popular", "urgent"],
  coupdecoeur: ["liked", "recent", "all", "enflammes", "recentcdc"],
  suggestion: [
    "discussed",
    "recentSuggestion",
    "allSuggest",
    "likedSuggestion",
  ],
};

const FilterIllustration = ({
  filter,
  selectedBrand,
  selectedCategory,
  siteUrl,
  onglet = "report",
}: Props) => {
  const brandEntries = useMemo(() => {
    return selectedBrand ? [{ brand: selectedBrand, siteUrl }] : [];
  }, [selectedBrand, siteUrl]);

  const brandLogos = useBrandLogos(brandEntries);

  const logoUrl = useMemo(() => {
    if (!selectedBrand || !brandLogos) return null;

    const brandKey = selectedBrand.toLowerCase().trim();
    const domain =
      siteUrl
        ?.replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .toLowerCase() || "";

    const possibleKeys = [
      `${brandKey}|${domain}`,
      `${brandKey}|${brandKey}.com`,
      brandKey,
    ];

    for (const k of possibleKeys) {
      if (brandLogos[k]) return brandLogos[k];
    }

    return null;
  }, [selectedBrand, siteUrl, brandLogos]);

  useEffect(() => {
    console.log("🧩 FilterIllustration props:", {
      selectedBrand,
      siteUrl,
      onglet,
    });
  }, [selectedBrand, siteUrl, onglet]);

  const shouldShowCategoryIcon =
    onglet === "report" && !!selectedBrand && !!selectedCategory;

  const categoryIcon: string | null = useMemo(() => {
    if (!shouldShowCategoryIcon) return null;
    return getCategoryIconPathFromSubcategory(
      selectedCategory,
      selectedBrand,
      onglet,
    );
  }, [selectedCategory, selectedBrand, shouldShowCategoryIcon, onglet]);

  const hasCategorySelection = shouldShowCategoryIcon && !!categoryIcon;

  const brandSoloImg: string | null = useMemo(() => {
    if (!selectedBrand) return null;
    if (onglet === "report") return reportBrandSolo;
    if (onglet === "coupdecoeur") return cdcBrandSolo;
    if (onglet === "suggestion") return suggestBrandSolo;
    return null;
  }, [selectedBrand, onglet]);

  const fallbackKey: keyof typeof illustrationMap = useMemo(() => {
    if (onglet === "coupdecoeur") return "all";
    if (onglet === "suggestion") return "allSuggest";
    return "confirmed";
  }, [onglet]);

  const listKey: keyof typeof illustrationMap = useMemo(() => {
    const availableKeys = filterKeysByTab[onglet] || [];
    const normalizedKey = filter as keyof typeof illustrationMap;
    if (availableKeys.includes(normalizedKey)) return normalizedKey;
    return fallbackKey;
  }, [filter, fallbackKey, onglet]);

  // === Cas 1 : Marque sélectionnée ===
  if (selectedBrand || selectedCategory) {
    const showCategoryOnly = hasCategorySelection && !!categoryIcon;
    const containerClassName = `filter-illustration-sidebar filtered${
      !showCategoryOnly && brandSoloImg ? " brand-solo" : ""
    }`;

    if (showCategoryOnly && categoryIcon) {
      return (
        <div className={containerClassName}>
          <div className="illustration-content category-icon-container">
            <div className="category-icon-wrapper">
              <img
                src={categoryIcon}
                alt={selectedCategory || "Catégorie"}
                className="category-icon"
              />
            </div>
          </div>
        </div>
      );
    }

    // ✅ 1️⃣ Priorité au logo dynamique Clearbit/backend
    const imgSrc =
      (logoUrl && logoUrl !== FALLBACK_BRAND_PLACEHOLDER ? logoUrl : null) ||
      brandSoloImg ||
      illustrationMap[fallbackKey].img;

    return (
      <div className={containerClassName}>
        <div className="illustration-content">
          <img
            src={imgSrc}
            alt={selectedBrand || "Illustration"}
            className={`brand-hero__img ${
              logoUrl ? "brand-logo" : "fallback-img"
            }`}
          />
        </div>
      </div>
    );
  }

  // === Cas 2 : Aucun filtre ===
  const data = illustrationMap[listKey];
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

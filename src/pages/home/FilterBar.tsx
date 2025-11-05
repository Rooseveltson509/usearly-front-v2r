import { useEffect, useState, useMemo } from "react";
import type { MouseEvent } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import BrandSelect from "@src/components/shared/BrandSelect";
import "./FilterBar.scss";
import CategoryDropdown from "@src/components/shared/CategoryDropdown";

interface Props {
  filter:
    | "hot"
    | "rage"
    | "popular"
    | "recent"
    | "urgent"
    | "confirmed"
    | "chrono"
    | "";
  setFilter: React.Dispatch<
    React.SetStateAction<
      | "hot"
      | "rage"
      | "popular"
      | "recent"
      | "urgent"
      | "confirmed"
      | "chrono"
      | ""
    >
  >;
  viewMode: "flat" | "chrono" | "confirmed";
  setViewMode: (val: "flat" | "chrono" | "confirmed") => void;
  setSelectedBrand: (val: string) => void;
  setSelectedCategory: (val: string) => void;
  setActiveFilter: (val: string) => void;
  onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;
  isHotFilterAvailable: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  selectedBrand: string;
  selectedCategory: string;
  selectedMainCategory?: string;
  setSelectedMainCategory?: (val: string) => void;
  availableBrands: (string | { brand: string; siteUrl?: string })[];
  availableCategories: string[];
  labelOverride?: string;
  setSelectedSiteUrl: (url?: string) => void;
  siteUrl?: string;
  availableSubCategoriesByBrandAndCategory?: Record<
    string, // marque
    Record<string, string[]> // catégorie principale -> sous-catégories
  >;
}

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[\s.]+$/g, "")
    .trim();

const filterOptions = [
  {
    value: "hot" as const,
    emoji: "🔥",
    label: "Problèmes les plus signalés",
  },
  {
    value: "rage" as const,
    emoji: "😡",
    label: "Problèmes les plus rageants",
  },
  {
    value: "popular" as const,
    emoji: "👍",
    label: "Signalements les plus populaires",
  },
  {
    value: "chrono" as const,
    emoji: "📅",
    label: "Signalements les plus récents",
  },
  {
    value: "urgent" as const,
    emoji: "👀",
    label: "À shaker vite",
  },
];

type FilterOptionValue = (typeof filterOptions)[number]["value"];

const FilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  /* viewMode, */
  setViewMode,
  setSelectedBrand,
  setSelectedCategory,
  setActiveFilter,
  onViewModeChange,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedBrand,
  selectedCategory,
  selectedMainCategory: externalSelectedMainCategory,
  setSelectedMainCategory: externalSetSelectedMainCategory,
  availableBrands,
  siteUrl,
  availableCategories,
  setSelectedSiteUrl,
  availableSubCategoriesByBrandAndCategory,
}) => {
  const [, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [filterHotactive, setFilterHotactive] = useState(false);
  const [heightSelectFilter, setHeightSelectFilter] = useState<number | null>(
    null,
  );
  const normalizedSelectValue = useMemo<FilterOptionValue>(() => {
    if (filter === "confirmed" || filter === "") {
      return "hot";
    }

    if (filter === "recent") {
      return "chrono";
    }

    if (filterOptions.some((option) => option.value === filter)) {
      return filter as FilterOptionValue;
    }

    return "hot";
  }, [filter]);
  const selectedOption =
    filterOptions.find((option) => option.value === normalizedSelectValue) ??
    filterOptions[0];

  // const filteredBrands = useMemo(() => {
  //   if (!brandSearch.trim()) return availableBrands;
  //   const query = normalize(brandSearch);
  //   return availableBrands.filter((brand) => normalize(brand).includes(query));
  // }, [availableBrands, brandSearch]);

  const normalizedCategories = useMemo(() => {
    if (!categorySearch.trim()) return availableCategories;
    const query = normalize(categorySearch);
    return availableCategories.filter((cat) => normalize(cat).includes(query));
  }, [availableCategories, categorySearch]);

  const [internalSelectedMainCategory, setInternalSelectedMainCategory] =
    useState("");

  const selectedMainCategory =
    externalSelectedMainCategory ?? internalSelectedMainCategory;

  const setSelectedMainCategory =
    externalSetSelectedMainCategory ?? setInternalSelectedMainCategory;

  const resetBrandFilters = () => {
    if (selectedBrand) {
      setSelectedBrand("");
    }
    if (selectedCategory) {
      setSelectedCategory("");
    }
    if (selectedMainCategory) {
      setSelectedMainCategory("");
    }
    setBrandSearch("");
    setCategorySearch("");
  };

  function clickFilterHot(className: string) {
    const el = document.querySelector(className);

    setFilterHotactive((prev) => {
      const next = !prev;

      if (next) {
        el?.classList.add("hot-active");
        let h = el?.scrollHeight ?? 0;
        if (h > 50) {
          h = 45;
        }
        setHeightSelectFilter(h);
      } else {
        el?.classList.remove("hot-active");
      }
      return next;
    });

    setTimeout(() => {
      setHeightSelectFilter(null);
      console.log("reset height");
    }, 200);
  }

  function hotFilterOption(value: FilterOptionValue) {
    return (event?: MouseEvent<HTMLSpanElement>) => {
      event?.stopPropagation();
      const wrapper = document.querySelector(".popup-hot-filter");
      wrapper?.classList.remove("is-open");

      setHeightSelectFilter(45);
      setTimeout(() => {
        setHeightSelectFilter(null);
      }, 200);

      setFilterHotactive(false);
      resetBrandFilters();

      if (value === "chrono") {
        setFilter("chrono");
        setViewMode("chrono");
        onViewModeChange?.("chrono");
        setActiveFilter("chrono");
      } else if (value === "hot") {
        setFilter("hot");
        setViewMode("confirmed");
        onViewModeChange?.("confirmed");
        setActiveFilter("confirmed");
      } else if (["rage", "popular", "urgent"].includes(value)) {
        setFilter(value);
        setViewMode("chrono");
        onViewModeChange?.("chrono");
        setActiveFilter(value);
      } else {
        setFilter("");
        setViewMode("flat");
        onViewModeChange?.("flat");
        setActiveFilter("");
      }
    };
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, setIsDropdownOpen, dropdownRef]);

  useEffect(() => {
    // Quand la marque change → reset des catégories
    setSelectedMainCategory("");
    setSelectedCategory("");
  }, [selectedBrand, setSelectedMainCategory, setSelectedCategory]);

  const handleBrandSelect = (brand: string, siteUrl?: string): void => {
    const normalized = brand.trim();
    setSelectedBrand(normalized);

    // ✅ Si siteUrl est vide, on tente de le retrouver depuis availableBrands
    if (siteUrl) {
      setSelectedSiteUrl(siteUrl);
    } else {
      const matched = availableBrands.find((b) => {
        if (typeof b === "object") return b.brand === brand;
        return false;
      }) as { brand: string; siteUrl?: string } | undefined;

      setSelectedSiteUrl(matched?.siteUrl || "");
    }

    console.log("✅ handleBrandSelect →", { brand, siteUrl });

    // 🧹 Réinitialise les filtres liés à la marque précédente
    setSelectedMainCategory("");
    setSelectedCategory("");

    setViewMode("flat");
    setFilter("");
    onViewModeChange?.("flat");
    setActiveFilter("");
  };

  const clearBrand = () => {
    resetBrandFilters();
    setViewMode("chrono");
    setFilter("chrono");
    onViewModeChange?.("chrono");
    setActiveFilter("chrono");
    setFilterHotactive(false);
    setHeightSelectFilter(null);
  };
  if (!selectedBrand) {
    return (
      <div className="filter-container">
        <div className="primary-filters">
          <div
            className={`select-filter-wrapper ${normalizedSelectValue === "hot" ? "hot-active" : ""}`}
            onClick={() => clickFilterHot(".select-filter-wrapper")}
          >
            <div
              style={{
                marginTop: heightSelectFilter
                  ? `${heightSelectFilter + 5}px`
                  : "50px",
              }}
              className={`popup-hot-filter ${filterHotactive ? "is-open" : ""}`}
            >
              <div className="popup-hot-filter-container">
                {filterOptions.map((option) => (
                  <span
                    key={option.value}
                    data-value={option.value}
                    onClick={hotFilterOption(option.value)}
                  >
                    {`${option.emoji} ${option.label}`}
                  </span>
                ))}
              </div>
            </div>
            <select
              style={{ display: "none" }}
              className="select-filter"
              value={normalizedSelectValue}
              onChange={(e) => {
                const value = e.target.value as FilterOptionValue;
                resetBrandFilters();

                if (value === "chrono") {
                  setFilter("chrono");
                  setViewMode("chrono");
                  onViewModeChange?.("chrono");
                  setActiveFilter("chrono");
                } else if (value === "hot") {
                  setFilter("hot");
                  setViewMode("confirmed");
                  onViewModeChange?.("confirmed");
                  setActiveFilter("confirmed");
                } else if (["rage", "popular", "urgent"].includes(value)) {
                  setFilter(value);
                  setViewMode("chrono");
                  onViewModeChange?.("chrono");
                  setActiveFilter(value);
                } else {
                  setFilter("");
                  setViewMode("flat");
                  onViewModeChange?.("flat");
                  setActiveFilter("");
                }
              }}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {`${option.emoji} ${option.label}`}
                </option>
              ))}
            </select>
            <span className="select-filter-display" aria-hidden="true">
              <span className="select-filter-content">
                <span className="select-filter-emoji">
                  {selectedOption?.emoji ?? ""}
                </span>
                <span className="select-filter-label">
                  {selectedOption?.label ?? ""}
                </span>
              </span>
              <ChevronDown size={16} className="select-filter-chevron" />
            </span>
          </div>
        </div>
        <div className="secondary-filters-container">
          <BrandSelect
            brands={availableBrands}
            selectedBrand={selectedBrand}
            onSelect={(brand, siteUrl) => handleBrandSelect(brand, siteUrl)}
            onClear={() => clearBrand()}
            placeholder="Choisir une marque"
            siteUrl={siteUrl}
          />
          <div className="filter-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="filter-toggle"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <SlidersHorizontal size={18} style={{ marginRight: "6px" }} />
              Filtrer
            </button>

            {isDropdownOpen && (
              <div className="filter-dropdown">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setViewMode("flat");
                    setFilter("");
                    onViewModeChange?.("flat");
                    setActiveFilter("");
                  }}
                  disabled={!selectedBrand}
                >
                  <option value="">Type de signalements</option>
                  {normalizedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {(selectedBrand || selectedCategory) && (
                  <button
                    className="reset"
                    onClick={() => {
                      clearBrand();
                      setCategorySearch("");
                    }}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (selectedBrand) {
    return (
      <div className="filters">
        <div className="filters__row">
          {/* Pill 1 : Marque (toujours visible) */}
          <div className="filters__pill filters__pill--brand">
            <BrandSelect
              brands={availableBrands}
              selectedBrand={selectedBrand}
              onSelect={(brand) => handleBrandSelect(brand)}
              onClear={() => clearBrand()}
              placeholder="Choisir une marque"
              className="pill__control"
              siteUrl={siteUrl}
            />
          </div>

          {/* Pill 2 : Catégorie principale (affichée si une marque est choisie) */}
          {selectedBrand && (
            <div className="filters__pill filters__pill--maincat">
              <CategoryDropdown
                categories={Object.keys(
                  availableSubCategoriesByBrandAndCategory?.[selectedBrand] ||
                    {},
                )}
                selected={selectedMainCategory}
                onSelect={(cat) => {
                  setSelectedMainCategory(cat);
                  setSelectedCategory("");
                  setViewMode("flat");
                  setFilter("");
                  onViewModeChange?.("flat");
                  setActiveFilter("");
                }}
              />
            </div>
          )}

          {/* Pill 3 : Sous-catégorie (si cat principale choisie) */}
          {selectedBrand && selectedMainCategory && (
            <div className="filters__pill filters__pill--subcat">
              <div className="pill__select">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setViewMode("flat");
                    setFilter("");
                    onViewModeChange?.("flat");
                    setActiveFilter("");
                  }}
                  aria-label="Sous-catégorie"
                >
                  <option value="">Sous-catégorie</option>
                  {(
                    availableSubCategoriesByBrandAndCategory?.[selectedBrand]?.[
                      selectedMainCategory
                    ] || []
                  ).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pill__chev" aria-hidden />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default FilterBar;

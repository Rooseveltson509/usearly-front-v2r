import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import SearchBar from "./components/searchBar/SearchBar";
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
  availableBrands: string[];
  availableCategories: string[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  labelOverride?: string;
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
  availableCategories,
  searchTerm,
  onSearchTermChange,
  availableSubCategoriesByBrandAndCategory,
}) => {
  const [, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
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

  const handleBrandSelect = (brand: string) => {
    const normalized = brand.trim();
    setSelectedBrand(normalized);

    // 🧹 Réinitialise complètement les filtres liés à la marque précédente
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
  };
  if (!selectedBrand) {
    return (
      <div className="filter-container">
        <div className="primary-filters">
          <div
            className={`select-filter-wrapper ${normalizedSelectValue === "hot" ? "hot-active" : ""}`}
          >
            <select
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
                  setFilter("confirmed");
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
            onSelect={(brand) => handleBrandSelect(brand)}
            onClear={() => clearBrand()}
            placeholder="Choisir une marque"
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
                {/* <div className="brand-search">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Rechercher une marque..."
                  />

                  {brandSearch && (
                    <ul className="autocomplete-list">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                          <li
                            key={brand}
                            onClick={() => {
                              handleBrandSelect(brand);
                              setBrandSearch("");
                              setCategorySearch("");
                              setIsDropdownOpen(false);
                            }}
                          >
                            {brand}
                          </li>
                        ))
                      ) : (
                        <li className="no-results">Aucune marque trouvée</li>
                      )}
                    </ul>
                  )}
                </div> */}

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

          <SearchBar
            value={searchTerm}
            onChange={onSearchTermChange}
            placeholder="Rechercher un signalement..."
          />
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

          {/* Recherche (se place en bout de ligne / passe en dessous selon le layout) */}
          <div className="filters__pill filters__pill--search">
            <SearchBar
              value={searchTerm}
              onChange={onSearchTermChange}
              placeholder="Rechercher un signalement…"
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default FilterBar;

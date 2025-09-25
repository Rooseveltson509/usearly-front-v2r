import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "./components/searchBar/SearchBar";
import "./FilterBar.scss";

interface Props {
  filter: "hot" | "rage" | "popular" | "recent" | "urgent" | "confirmed" | "chrono" | "";
  setFilter: React.Dispatch<
    React.SetStateAction<
      "hot" | "rage" | "popular" | "recent" | "urgent" | "confirmed" | "chrono" | ""
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
  availableBrands: string[];
  availableCategories: string[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  labelOverride?: string;
}

// ✅ fonction de normalisation (mêmes règles que dans HomeGroupedReportsList)
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[’']/g, "'") // apostrophes
    .replace(/[\s.]+$/g, "") // espaces/points finaux
    .trim();

const FilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  viewMode,
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
  availableBrands,
  availableCategories,
  searchTerm,
  onSearchTermChange,
}) => {
  const [brandSearch, setBrandSearch] = useState("");

  // ✅ recherche marque normalisée
  const filteredBrands = brandSearch.trim()
    ? availableBrands.filter((b) => normalize(b).includes(normalize(brandSearch)))
    : availableBrands;

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

  return (
    <>
      <div className="filter-container">
        {/* 🔥 Premier select = filtres globaux */}
        <div
          className={`select-filter-wrapper ${
            filter === "hot" ? "hot-active" : ""
          }`}
        >
          <select
            className="select-filter"
            value={filter === "confirmed" ? "hot" : filter}
            onChange={(e) => {
              const value = e.target.value as typeof filter;
              setSelectedBrand("");
              setSelectedCategory("");

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
              } else if (["rage", "popular", "recent", "urgent"].includes(value)) {
                setFilter(value as any);
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
            <option value="hot">🔥 Problèmes les plus signalés</option>
            <option value="rage">😡 Problèmes les plus rageants</option>
            <option value="popular">👍 Signalements les plus populaires</option>
            <option value="recent">📅 Signalements les plus récents</option>
            <option value="urgent">👀 À shaker vite</option>
          </select>
        </div>

        {/* 🔧 Deuxième filtre : input + catégories */}
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
              {/* 🔍 Recherche marque */}
              <input
                type="text"
                value={brandSearch || selectedBrand}
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
                          setSelectedBrand(brand);
                          setSelectedCategory("");
                          setBrandSearch("");
                          setIsDropdownOpen(false);

                          // 👉 Mode recherche (filtre vide)
                          setViewMode("flat");
                          setFilter("");
                          onViewModeChange?.("flat");
                          setActiveFilter("");
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

              {/* 🎯 Select catégories dépendantes de la marque */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);

                  // 👉 reste en mode recherche (filtre vide)
                  setViewMode("flat");
                  setFilter("");
                  onViewModeChange?.("flat");
                  setActiveFilter("");
                }}
                disabled={!selectedBrand}
              >
                <option value="">Toutes les catégories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {(selectedBrand || selectedCategory) && (
                <button
                  className="reset"
                  onClick={() => {
                    setSelectedBrand("");
                    setSelectedCategory("");
                    setBrandSearch("");

                    // 👉 retour au comportement par défaut
                    setViewMode("confirmed");
                    setFilter("confirmed");
                    onViewModeChange?.("confirmed");
                    setActiveFilter("confirmed");
                  }}
                >
                  Réinitialiser
                </button>
              )}
            </div>
          )}
          <SearchBar
            value={searchTerm}
            onChange={onSearchTermChange}
            placeholder="Rechercher un signalement..."
          />
        </div>
      </div>
    </>
  );
};

export default FilterBar;

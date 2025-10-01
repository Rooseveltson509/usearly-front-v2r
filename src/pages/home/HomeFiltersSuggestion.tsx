import { useState, useRef, useEffect, useMemo } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import "./HomeFiltersSuggestion.scss";
import { getAllBrandsSuggestion } from "@src/services/coupDeCoeurService";
import { CiSearch } from "react-icons/ci";
import BrandSelect from "@src/components/shared/BrandSelect";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availableCategories: string[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

const HomeFiltersSuggestion = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  searchQuery,
  onSearchChange,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">(
    "flat",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const baseOptions = useMemo(
    () => [
      { value: "allSuggest", label: "👍️ Suggestions les plus populaires" },
      { value: "recentSuggestion", label: "🪄 Suggestions ouvertes aux votes" },
      { value: "likedSuggestion", label: "🙌 Suggestions adoptées" },
    ],
    [],
  );

  const filterOptions = useMemo(() => {
    return baseOptions;
  }, [baseOptions]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await getAllBrandsSuggestion();
        setAvailableBrands(brands);
      } catch (e) {
        console.error("Erreur chargement marques:", e);
      }
    };
    fetchBrands();
  }, []);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory("");
    setFilter(brand ? "brandSolo" : "allSuggest");
    if (!brand) {
      onSearchChange("");
    }
  };

  return (
    <div className="controls">
        <FilterBarGeneric
          options={filterOptions}
          filter={filter}
          setFilter={setFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setSelectedBrand={handleBrandSelect}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          availableBrands={availableBrands}
          availableCategories={availableCategories}
          dropdownRef={dropdownRef}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          withBrands={!selectedBrand}
          withCategories={!selectedBrand}
          brandFocusFilter="brandSolo"
          baseFilterValue="allSuggest"
          hideFilterWhenBrandSelected={true}
        />

      <BrandSelect
        brands={availableBrands}
        selectedBrand={selectedBrand}
        onSelect={(brand) => handleBrandSelect(brand)}
        onClear={() => handleBrandSelect("")}
        placeholder="Choisir une marque"
      />

      {selectedBrand && (
        <div className="suggestion-search">
          <CiSearch />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par titre, contenu ou marque"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => onSearchChange("")}
            >
              Effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeFiltersSuggestion;

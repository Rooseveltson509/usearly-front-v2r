import { useState, useRef, useEffect } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import "./HomeFiltersSuggestion.scss";
import { getAllBrandsSuggestion } from "@src/services/coupDeCoeurService";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
}

const HomeFiltersSuggestion = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("flat");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

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

  return (
    <div className="controls">
    <FilterBarGeneric
      options={[
        { value: "allSuggest", label: "👍️ Suggestions les plus populaires" }, // ✅ Ajout du filtre neutre
        // { value: "discussed", label: "💬 Les plus discutées" },
        { value: "recentSuggestion", label: "🪄 Suggestions ouvertes aux votes" },
        { value: "likedSuggestion", label: "🙌 Suggestions adoptées" },
      ]}
      filter={filter}
      setFilter={setFilter}
      viewMode={viewMode}
      setViewMode={setViewMode}
      dropdownRef={dropdownRef}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      withBrands={true}
      withCategories={false}
      availableBrands={availableBrands}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
    />
    </div>
  );
};

export default HomeFiltersSuggestion;

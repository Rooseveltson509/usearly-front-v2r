import { useState, useRef } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import "./HomeFiltersSuggestion.scss";


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

  const availableBrands = ["Nike", "Adidas", "Zara"]; // 👉 idem, brancher useBrands()

  return (
    <FilterBarGeneric
      options={[
        { value: "discussed", label: "💬 Les plus discutées" },
        { value: "recentSuggestion", label: "🕒 Les plus récentes" },
        { value: "likedSuggestion", label: "👍 Les plus appréciées" },
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
  );
};

export default HomeFiltersSuggestion;

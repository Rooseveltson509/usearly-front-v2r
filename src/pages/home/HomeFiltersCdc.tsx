import { useState, useRef } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import "./HomeFiltersCdc.scss";


interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
}

const HomeFiltersCdc = ({ filter, setFilter, selectedBrand, setSelectedBrand }: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("flat");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const availableBrands = ["Nike", "Adidas", "Zara"]; // 👉 à remplacer par ton hook useBrands()

  return (
    <FilterBarGeneric
      options={[
        { value: "liked", label: "🥰 Les plus aimés" },
        { value: "recent", label: "🕒 Les plus récents" },
        { value: "commented", label: "💬 Les plus commentés" },
      ]}
      filter={filter}
      setFilter={setFilter}
      viewMode={viewMode}
      setViewMode={setViewMode}
      dropdownRef={dropdownRef}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      withBrands={true}
      withCategories={false} // ✅ pas besoin de sous-cat
      availableBrands={availableBrands}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
    />
  );
};

export default HomeFiltersCdc;

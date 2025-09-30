import { useState, useEffect, useRef, useMemo } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import { getAllBrands } from "@src/services/coupDeCoeurService";
import BrandSelect from "@src/components/shared/BrandSelect";
import "./HomeFiltersCdc.scss";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availableCategories: string[];
}

const HomeFiltersCdc = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("flat");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const baseOptions = useMemo(
    () => [
      { value: "all", label: "👍 Coups de cœur populaires" },
      { value: "enflammes", label: "❤️‍🔥 Coups de cœur les plus enflammés" },
      { value: "recent", label: "💌 Coups de cœur les plus récents" },
    ],
    []
  );

  const options = useMemo(() => {
    return baseOptions;
  }, [baseOptions]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await getAllBrands();
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
    setFilter(brand ? "brandSolo" : "all");
  };

  return (
    <div className="controls">
      <FilterBarGeneric
        options={options}
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
        withBrands={true}
        withCategories={true}
        brandFocusFilter="brandSolo"
        baseFilterValue="all"
      />
    </div>
  );
};

export default HomeFiltersCdc;

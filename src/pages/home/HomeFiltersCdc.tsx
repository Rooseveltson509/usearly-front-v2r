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
}

const HomeFiltersCdc = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
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
    if (selectedBrand) {
      return [
        { value: "brandSolo", label: `${selectedBrand} • solo` },
        ...baseOptions,
      ];
    }
    return baseOptions;
  }, [baseOptions, selectedBrand]);

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
        dropdownRef={dropdownRef}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        withBrands={false}
        withCategories={false}
        brandFocusFilter="brandSolo"
        baseFilterValue="all"
      />

      <BrandSelect
        brands={availableBrands}
        selectedBrand={selectedBrand}
        onSelect={(brand) => handleBrandSelect(brand)}
        onClear={() => handleBrandSelect("")}
        placeholder="Choisir une marque"
      />
    </div>
  );
};

export default HomeFiltersCdc;

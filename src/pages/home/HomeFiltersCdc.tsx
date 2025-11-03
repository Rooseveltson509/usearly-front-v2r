import { useState, useRef, useMemo } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import { useBrands } from "@src/hooks/useBrands"; // ✅ on réutilise ton hook existant
import "./HomeFiltersCdc.scss";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string, siteUrl?: string) => void; // ✅ garde siteUrl
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  availableCategories: string[];
  siteUrl?: string;
  setSelectedSiteUrl?: (val?: string) => void;
}

const HomeFiltersCdc = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
  /*  selectedCategory, */
  setSelectedCategory,
  /* availableCategories, */
  siteUrl,
  setSelectedSiteUrl,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">(
    "flat",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ récupération dynamique des marques depuis useBrands
  const { brands, loading } = useBrands("coupdecoeur");

  const availableBrands = useMemo(
    () => brands.map((b) => ({ brand: b.marque, siteUrl: b.siteUrl })),
    [brands],
  );

  const baseOptions = useMemo(
    () => [
      { value: "all", label: "👍 Coups de cœur populaires" },
      { value: "enflammes", label: "❤️‍🔥 Coups de cœur les plus enflammés" },
      { value: "recent", label: "💌 Coups de cœur les plus récents" },
    ],
    [],
  );

  const handleBrandSelect = (brand: string, brandSiteUrl?: string) => {
    setSelectedBrand(brand, brandSiteUrl);
    setSelectedCategory("");
    setFilter(brand ? "brandSolo" : "all");
    if (setSelectedSiteUrl) setSelectedSiteUrl(brandSiteUrl);
  };

  return (
    <div className="controls">
      <FilterBarGeneric
        options={baseOptions}
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setSelectedBrand={handleBrandSelect}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        availableBrands={availableBrands}
        dropdownRef={dropdownRef}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        withBrands={!loading}
        brandFocusFilter="brandSolo"
        baseFilterValue="all"
        siteUrl={siteUrl}
      />
    </div>
  );
};

export default HomeFiltersCdc;

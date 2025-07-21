import { SlidersHorizontal } from "lucide-react";

interface Props {
  filter: "hot" | "rage" | "popular" | "urgent" | "";
  setFilter: React.Dispatch<React.SetStateAction<"hot" | "rage" | "popular" | "urgent" | "">>;
  viewMode: "flat" | "chrono";
  setViewMode: (val: "flat" | "chrono") => void;
  setSelectedBrand: (val: string) => void;
  setSelectedCategory: (val: string) => void;
  setActiveFilter: (val: string) => void;
  onViewModeChange?: (mode: "flat" | "chrono") => void;
  isHotFilterAvailable: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  selectedBrand: string;
  selectedCategory: string;
  availableBrands: string[];
  availableCategories: string[];
}

const FilterBar: React.FC<Props> = ({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  setSelectedBrand,
  setSelectedCategory,
  setActiveFilter,
  onViewModeChange,
  isHotFilterAvailable,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedBrand,
  selectedCategory,
  availableBrands,
  availableCategories,
}) => {
  return (
    <>
      <div className={`select-filter-wrapper ${filter === "hot" ? "hot-active" : ""}`}>
        <select
          className="select-filter"
          value={filter !== "" ? filter : viewMode}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedBrand("");
            setSelectedCategory("");

            if (["hot", "rage", "popular", "urgent"].includes(value)) {
              setFilter(value as any);
              setViewMode("chrono");
              onViewModeChange?.("chrono");
              setActiveFilter(value);
            } else {
              setFilter("");
              setViewMode(value as "flat" | "chrono");
              onViewModeChange?.(value as "flat" | "chrono");
              setActiveFilter("");
            }
          }}
        >
          <option value="flat">🏷️ Les plus récents</option>
          <option value="chrono">🕒 Vue par date</option>
          {isHotFilterAvailable && <option value="hot"> Ça chauffe par ici</option>}
          <option value="rage">😡 Les plus rageants</option>
          <option value="popular">👍 Les plus populaires</option>
          <option value="urgent">👀 À shaker vite</option>
        </select>
      </div>

      <div className="filter-dropdown-wrapper" ref={dropdownRef}>
        <button className="filter-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <SlidersHorizontal size={18} style={{ marginRight: "6px" }} />
          Filtrer
        </button>

        {isDropdownOpen && (
          <div className="filter-dropdown">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setViewMode("flat");
                setFilter("");
                onViewModeChange?.("flat");
                setActiveFilter("");
              }}
            >
              <option value="">Toutes les marques</option>
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setViewMode("flat");
                setFilter("");
                onViewModeChange?.("flat");
                setActiveFilter("");
              }}
            >
              <option value="">Toutes les catégories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {(selectedBrand || selectedCategory) && (
              <button
                className="reset"
                onClick={() => {
                  setSelectedBrand("");
                  setSelectedCategory("");
                  setViewMode("flat");
                  setFilter("");
                  onViewModeChange?.("flat");
                  setActiveFilter("");
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterBar;
import { SlidersHorizontal } from "lucide-react";

interface Props {
  filter: "hot" | "rage" | "popular" | "urgent" | "confirmed" | "chrono" | "";
  setFilter: React.Dispatch<React.SetStateAction<"hot" | "rage" | "popular" | "urgent" | "confirmed" | "chrono" | "">>;
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
  labelOverride?: string;
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
  labelOverride,
}) => {
  return (
    <>
      <div className={`select-filter-wrapper ${filter === "hot" ? "hot-active" : ""}`}>
        <select
          className="select-filter"
          value={filter === "confirmed" ? "hot" : filter}
          onChange={(e) => {
            const value = e.target.value as "hot" | "rage" | "popular" | "urgent" | "confirmed" | "chrono" | "";

            setSelectedBrand("");
            setSelectedCategory("");

            if (value === "chrono") {
              setFilter("chrono");
              setViewMode("chrono");
              onViewModeChange?.("chrono");
              setActiveFilter("");
            } else if (value === "hot") {
              setFilter("confirmed"); // 🟢 le vrai filtre est "confirmed"
              setViewMode("confirmed");
              onViewModeChange?.("confirmed");
              setActiveFilter("confirmed");
            } else if (["rage", "popular", "urgent"].includes(value)) {
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

          <option value="chrono">🏷️ Les plus récents</option>
          <option value="hot">🔥 Ça chauffe par ici</option>
          {/*          {isHotFilterAvailable && (
            <option value="hot">🔥 Ça chauffe par ici</option>
          )} */}
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

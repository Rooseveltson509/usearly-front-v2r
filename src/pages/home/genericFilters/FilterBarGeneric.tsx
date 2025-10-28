import { useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { BrandSelect } from "@src/components/shared/BrandSelect";
import "./FilterBar.scss";

export interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  filter: string;
  setFilter: (val: string) => void;

  viewMode: "flat" | "chrono" | "confirmed";
  setViewMode: (val: "flat" | "chrono" | "confirmed") => void;

  setSelectedBrand?: (val: string) => void;
  setSelectedCategory?: (val: string) => void;
  setActiveFilter?: (val: string) => void;

  onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;

  // Filtres dynamiques
  options: FilterOption[];

  // Recherche marque/catégorie (activable au besoin)
  withBrands?: boolean;
  withCategories?: boolean;

  availableBrands?: string[];
  availableCategories?: string[];

  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (val: boolean) => void;

  selectedBrand?: string;
  selectedCategory?: string;
  labelOverride?: string;
  locationInfo?: string | null;

  brandFocusFilter?: string;
  baseFilterValue?: string;

  hideFilterWhenBrandSelected?: boolean;
}

const splitLeadingEmoji = (label: string) => {
  const trimmed = label.trim();
  if (!trimmed) {
    return { emoji: "", text: "" };
  }

  const [firstToken, ...rest] = trimmed.split(/\s+/);
  const hasAlphaNumeric = /[0-9A-Za-z]/.test(firstToken);
  if (!hasAlphaNumeric && rest.length > 0) {
    return { emoji: firstToken, text: rest.join(" ") };
  }

  return { emoji: "", text: trimmed };
};

const FilterBarGeneric: React.FC<Props> = ({
  filter,
  setFilter,
  setViewMode,
  setSelectedBrand = () => {},
  setSelectedCategory = () => {},
  setActiveFilter = () => {},
  onViewModeChange,
  options,
  withBrands = false,
  // withCategories = false,
  availableBrands = [],
  // availableCategories = [],
  dropdownRef,
  isDropdownOpen = false,
  setIsDropdownOpen = () => {},
  selectedBrand = "",
  // selectedCategory = "",
  locationInfo = null,
  brandFocusFilter = "",
  baseFilterValue,
  // hideFilterWhenBrandSelected = false,
}) => {
  const parsedOptions = useMemo(() => {
    return options.map((opt) => {
      const { emoji, text } = splitLeadingEmoji(opt.label);
      return {
        ...opt,
        emoji,
        displayLabel: text,
      };
    });
  }, [options]);

  const fallbackOption = useMemo(() => {
    if (baseFilterValue) {
      return parsedOptions.find((opt) => opt.value === baseFilterValue);
    }
    return parsedOptions[0];
  }, [parsedOptions, baseFilterValue]);

  const selectedOption = useMemo(() => {
    return (
      parsedOptions.find((opt) => opt.value === filter) ??
      fallbackOption ?? {
        value: "",
        label: "",
        emoji: "",
        displayLabel: "",
      }
    );
  }, [parsedOptions, filter, fallbackOption]);

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

  const brandFilterValue = useMemo(() => {
    if (brandFocusFilter && brandFocusFilter.length > 0) {
      return brandFocusFilter;
    }
    return parsedOptions[0]?.value ?? "";
  }, [brandFocusFilter, parsedOptions]);

  const fallbackFilterValue = useMemo(() => {
    if (baseFilterValue) {
      return baseFilterValue;
    }
    const alternative = parsedOptions.find(
      (opt) => opt.value !== brandFilterValue,
    );
    return alternative?.value ?? parsedOptions[0]?.value ?? "";
  }, [baseFilterValue, parsedOptions, brandFilterValue]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory("");

    if (brand) {
      if (brandFilterValue) {
        setFilter(brandFilterValue);
        setActiveFilter(brandFilterValue);
      }
      setViewMode("flat");
      onViewModeChange?.("flat");
    } else {
      if (fallbackFilterValue) {
        setFilter(fallbackFilterValue);
        setActiveFilter(fallbackFilterValue);
      }
      setViewMode("chrono");
      onViewModeChange?.("chrono");
    }

    setIsDropdownOpen(false);
  };

  // const showFilterDropdown =
  //   withCategories && (!hideFilterWhenBrandSelected || !selectedBrand);

  return (
    <div className="filter-bar-generic-container">
      {/* <BobIcon brand="netflix" category="tv_cinema" iconName="popcorn" /> */}
      {/* 🔥 Premier select = filtres dynamiques */}
      <div className="select-filter-wrapper">
        <select
          className={`select-filter ${locationInfo === "cdc" ? "cdc-style" : ""}`}
          value={filter}
          onChange={(e) => {
            const value = e.target.value;

            // reset marque/catégorie si on change de filtre
            setSelectedBrand("");
            setSelectedCategory("");

            setFilter(value);
            setActiveFilter(value);

            // par défaut → mode chrono
            setViewMode("chrono");
            onViewModeChange?.("chrono");
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-filter-display" aria-hidden="true">
          <span className="select-filter-content">
            {selectedOption?.emoji && (
              <span className="select-filter-emoji">
                {selectedOption.emoji}
              </span>
            )}
            <span className="select-filter-label">
              {selectedOption?.displayLabel || selectedOption?.label || ""}
            </span>
          </span>
          <ChevronDown size={16} className="select-filter-chevron" />
        </span>
      </div>

      {/* 🔧 Deuxième filtre : input + catégories (optionnel) */}
      <div className="filter-bar-generic-actions">
        {withBrands && (
          <BrandSelect
            brands={availableBrands ?? []}
            selectedBrand={selectedBrand}
            onSelect={handleBrandChange}
            onClear={() => handleBrandChange("")}
            placeholder="Choisir une marque"
            className="brand-select-inline"
          />
        )}

        {/* {showFilterDropdown && (
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
                {withCategories && availableCategories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const nextCategory = e.target.value;
                      setSelectedCategory(nextCategory);
                      setViewMode("flat");
                      setFilter("");
                      setActiveFilter("");
                      onViewModeChange?.("flat");
                    }}
                  >
                    <option value="">Toutes les catégories</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}

                {(selectedBrand || selectedCategory) && (
                  <button
                    className="reset"
                    onClick={() => {
                      handleBrandChange("");
                      setSelectedCategory("");
                    }}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FilterBarGeneric;

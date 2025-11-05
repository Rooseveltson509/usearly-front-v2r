import { useEffect, useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
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
  setSelectedBrand?: (brand: string, siteUrl?: string) => void; // ✅ supporte siteUrl
  setSelectedCategory?: (val: string) => void;
  setActiveFilter?: (val: string) => void;
  onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;
  options: FilterOption[];
  withBrands?: boolean;
  availableBrands?: (string | { brand: string; siteUrl?: string })[];
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (val: boolean) => void;
  selectedBrand?: string;
  labelOverride?: string;
  locationInfo?: string | null;
  brandFocusFilter?: string;
  baseFilterValue?: string;
  siteUrl?: string;
}

const splitLeadingEmoji = (label: string) => {
  const trimmed = label.trim();
  if (!trimmed) return { emoji: "", text: "" };

  const [firstToken, ...rest] = trimmed.split(/\s+/);
  const hasAlphaNumeric = /[0-9A-Za-z]/.test(firstToken);
  if (!hasAlphaNumeric && rest.length > 0)
    return { emoji: firstToken, text: rest.join(" ") };
  return { emoji: "", text: trimmed };
};

export const FilterBarGeneric: React.FC<Props> = ({
  filter,
  setFilter,
  setViewMode,
  setSelectedBrand = () => {},
  setSelectedCategory = () => {},
  setActiveFilter = () => {},
  onViewModeChange,
  options,
  withBrands = false,
  availableBrands = [],
  dropdownRef,
  isDropdownOpen = false,
  setIsDropdownOpen = () => {},
  selectedBrand = "",
  locationInfo = null,
  brandFocusFilter = "",
  baseFilterValue,
  siteUrl,
}) => {
  const [filterHotactive, setFilterHotactive] = useState(false);
  const [heightSelectFilter, setHeightSelectFilter] = useState<number | null>(
    null,
  );
  const parsedOptions = useMemo(() => {
    return options.map((opt) => {
      const { emoji, text } = splitLeadingEmoji(opt.label);
      return { ...opt, emoji, displayLabel: text };
    });
  }, [options]);

  const fallbackOption = useMemo(() => {
    if (baseFilterValue)
      return parsedOptions.find((opt) => opt.value === baseFilterValue);
    return parsedOptions[0];
  }, [parsedOptions, baseFilterValue]);

  const selectedOption = useMemo(() => {
    return (
      parsedOptions.find((opt) => opt.value === filter) ??
      fallbackOption ?? { value: "", label: "", emoji: "", displayLabel: "" }
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
    if (isDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, setIsDropdownOpen, dropdownRef]);

  const brandFilterValue = useMemo(() => {
    if (brandFocusFilter) return brandFocusFilter;
    return parsedOptions[0]?.value ?? "";
  }, [brandFocusFilter, parsedOptions]);

  const fallbackFilterValue = useMemo(() => {
    if (baseFilterValue) return baseFilterValue;
    const alternative = parsedOptions.find(
      (opt) => opt.value !== brandFilterValue,
    );
    return alternative?.value ?? parsedOptions[0]?.value ?? "";
  }, [baseFilterValue, parsedOptions, brandFilterValue]);

  function clickFilterHot(className: string) {
    const el = document.querySelector(className);

    setFilterHotactive((prev) => {
      const next = !prev;

      if (next) {
        el?.classList.add("hot-active");
        let h = el?.scrollHeight ?? 0;
        if (h > 50) {
          h = 45;
        }
        setHeightSelectFilter(h);
      } else {
        el?.classList.remove("hot-active");
      }
      return next;
    });

    setTimeout(() => {
      setHeightSelectFilter(null);
      console.log("reset height");
    }, 200);
  }

  function hotFilterOption(value: string) {
    return (event?: ReactMouseEvent<HTMLSpanElement>) => {
      event?.stopPropagation();
      const wrapper = document.querySelector(".popup-hot-filter");
      wrapper?.classList.remove("is-open");

      setHeightSelectFilter(45);
      setTimeout(() => {
        setHeightSelectFilter(null);
      }, 200);

      setFilterHotactive(false);

      setSelectedBrand("");
      setSelectedCategory?.("");
      setFilter(value);
      setActiveFilter?.(value);
      setViewMode("chrono");
      onViewModeChange?.("chrono");
    };
  }

  const handleBrandChange = (brand: string, brandSiteUrl?: string) => {
    setSelectedBrand(brand, brandSiteUrl);
    setSelectedCategory("");

    if (brand) {
      setFilter(brandFilterValue);
      setActiveFilter(brandFilterValue);
      setViewMode("flat");
      onViewModeChange?.("flat");
    } else {
      setFilter(fallbackFilterValue);
      setActiveFilter(fallbackFilterValue);
      setViewMode("chrono");
      onViewModeChange?.("chrono");
    }

    setIsDropdownOpen(false);
  };

  return (
    <div className="filter-bar-generic-container">
      {/* 🔹 Menu déroulant de tri */}
      <div
        className="select-filter-wrapper"
        onClick={() =>
          clickFilterHot(".filter-bar-generic-container .select-filter-wrapper")
        }
      >
        <div
          style={{
            marginTop: heightSelectFilter
              ? `${heightSelectFilter + 5}px`
              : "50px",
          }}
          className={`popup-hot-filter ${filterHotactive ? "is-open" : ""}`}
        >
          <div className="popup-hot-filter-container">
            {options.map((option) => (
              <span
                key={option.value}
                data-value={option.value}
                onClick={hotFilterOption(option.value)}
              >
                {`${option.label}`}
              </span>
            ))}
          </div>
        </div>
        <select
          style={{ display: "none" }}
          className={`select-filter ${locationInfo === "cdc" ? "cdc-style" : ""}`}
          value={filter}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedBrand("");
            setSelectedCategory?.("");
            setFilter(value);
            setActiveFilter?.(value);
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

      {/* 🔹 Sélecteur de marque */}
      {withBrands && (
        <div className="filter-bar-generic-actions">
          <BrandSelect
            brands={availableBrands}
            selectedBrand={selectedBrand}
            onSelect={handleBrandChange} // ✅ transmet (brand, siteUrl)
            onClear={() => handleBrandChange("")}
            placeholder="Choisir une marque"
            className="brand-select-inline"
            siteUrl={siteUrl}
          />
        </div>
      )}
    </div>
  );
};

export default FilterBarGeneric;

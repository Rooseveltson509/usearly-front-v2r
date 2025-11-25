import React from "react";

import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";
import { categoryIcons } from "@src/utils/categoriesIcon";
import "./ProfileFilters.scss";

const DEFAULT_CATEGORY_ICON =
  categoryIcons["Autre souci"] || "/assets/categories-icons/other.png";

interface Props {
  availableBrands: string[];
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  availableCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const ProfileFilters: React.FC<Props> = ({
  availableBrands,
  selectedBrand,
  setSelectedBrand,
  availableCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const isTous = (s?: string) =>
    (s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim() === "tous";

  const brandOptions = React.useMemo<SelectFilterOption[]>(() => {
    const placeholder: SelectFilterOption = {
      value: "",
      label: "Choisir une marque",
    };
    if (!availableBrands.length) return [placeholder];

    const normalized = availableBrands
      .filter((brand) => !isTous(brand))
      .map((brand) => ({
        value: brand,
        label: brand,
        iconAlt: brand,
        iconFallback: brand,
      }));

    return [placeholder, ...normalized];
  }, [availableBrands]);

  const resolvedBrandValue = React.useMemo(
    () => (!selectedBrand || isTous(selectedBrand) ? "" : selectedBrand),
    [selectedBrand],
  );

  const handleBrandChange = React.useCallback(
    (value: string) => {
      const next = !value || isTous(value) ? "Tous" : value;
      setSelectedBrand(next);

      if (next === "Tous") {
        setSelectedCategory("Tous");
      }
    },
    [setSelectedBrand, setSelectedCategory],
  );

  const categoryOptions = React.useMemo<SelectFilterOption[]>(() => {
    const placeholder: SelectFilterOption = {
      value: "",
      label: "Select Category",
      iconUrl: DEFAULT_CATEGORY_ICON,
      iconAlt: "Select Category",
      iconFallback: "SC",
    };
    if (!availableCategories.length) return [placeholder];
    return [
      placeholder,
      ...availableCategories.map((cat) => ({
        value: cat,
        label: cat,
        iconUrl: categoryIcons[cat] ?? DEFAULT_CATEGORY_ICON,
        iconAlt: cat,
        iconFallback: cat,
      })),
    ];
  }, [availableCategories]);

  return (
    <div className="profile-filters">
      <div className="control">
        <Champs
          options={brandOptions}
          value={resolvedBrandValue}
          onChange={handleBrandChange}
          className="brand-select--profile"
          brandSelect
          minWidth={225}
          minWidthPart="2"
          align="left"
        />
        <Champs
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="profile-filters__category"
          disabled={!availableCategories.length}
          variant="grid"
        />
      </div>
    </div>
  );
};

export default ProfileFilters;

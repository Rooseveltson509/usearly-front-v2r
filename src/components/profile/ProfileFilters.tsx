import React from "react";

import { BrandSelect } from "../shared/BrandSelect";
import CategoryDropdown from "@src/components/shared/CategoryDropdown";
import "./ProfileFilters.scss";

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
  return (
    <div className="profile-filters">
      <div className="control">
        <BrandSelect
          brands={availableBrands}
          selectedBrand={selectedBrand}
          onSelect={setSelectedBrand}
          placeholder="Select Brand"
          className="brand-select--profile"
        />
        <CategoryDropdown
          categories={availableCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          placeholder="Select Category"
        />
        {/* <div className="select-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="chevron-icon" size={16} />
        </div> */}
      </div>
    </div>
  );
};

export default ProfileFilters;

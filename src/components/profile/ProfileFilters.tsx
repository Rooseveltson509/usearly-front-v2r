import React from "react";

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
    setSelectedCategory
}) => {
    return (
        <div className="profile-filters">
            <div className="controls">
            <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                ))}
            </select>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            </div>
        </div>
    );
};

export default ProfileFilters;

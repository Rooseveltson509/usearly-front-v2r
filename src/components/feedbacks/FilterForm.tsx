import React from "react";

interface Props {
  brandInput: string;
  setBrandInput: (value: string) => void;
  suggestions: string[];
  handleSelectSuggestion: (brand: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  availableCategories: string[];
}

const FilterForm: React.FC<Props> = ({
  brandInput,
  setBrandInput,
  suggestions,
  handleSelectSuggestion,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
}) => {
  return (
    <div className="filter-form">
      <div className="brand-input-container">
        <input
          type="text"
          className="brand-input-field"
          placeholder="Rechercher une marque..."
          value={brandInput}
          onChange={(e) => setBrandInput(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="brand-suggestions">
            {suggestions.map((brand) => (
              <li key={brand} onClick={() => handleSelectSuggestion(brand)}>
                {brand}
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">-- Sélectionner une catégorie --</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterForm;
//
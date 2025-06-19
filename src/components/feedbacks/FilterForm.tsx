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
      <input
        value={brandInput}
        onChange={(e) => setBrandInput(e.target.value)}
        placeholder="Rechercher une marque..."
      />

      {brandInput.trim() !== "" && suggestions.length > 0 && (
        <ul className="brand-suggestions">
          {suggestions.map((brand) => (
            <li key={brand} onClick={() => handleSelectSuggestion(brand)}>
              {brand}
            </li>
          ))}
        </ul>
      )}

      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">-- Sélectionner une catégorie --</option>
        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterForm;

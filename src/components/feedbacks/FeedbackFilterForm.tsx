// import React from "react";
// import "./FeedbackFilterForm.scss"; // si tu as un style associé

// interface Props {
//   brandInput: string;
//   setBrandInput: (val: string) => void;
//   suggestions: string[];
//   onSelectSuggestion: (brand: string) => void;
//   selectedCategory: string;
//   setSelectedCategory: (val: string) => void;
//   availableCategories: string[];
// }

// const FeedbackFilterForm = ({
//   brandInput,
//   setBrandInput,
//   suggestions,
//   onSelectSuggestion,
//   selectedCategory,
//   setSelectedCategory,
//   availableCategories,
// }: Props) => {
//   return (
//     <div className="filter-form">
//       <input
//         value={brandInput}
//         onChange={(e) => setBrandInput(e.target.value)}
//         placeholder="Rechercher une marque..."
//         className="brand-input"
//       />

//       {brandInput.trim() !== "" && suggestions.length > 0 && (
//         <ul className="brand-suggestions">
//           {suggestions.map((brand) => (
//             <li key={brand} onClick={() => onSelectSuggestion(brand)}>
//               {brand}
//             </li>
//           ))}
//         </ul>
//       )}

//       <select
//         value={selectedCategory}
//         onChange={(e) => setSelectedCategory(e.target.value)}
//         className="category-select"
//       >
//         <option value="">-- Sélectionner une catégorie --</option>
//         {availableCategories.map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default FeedbackFilterForm;
// //

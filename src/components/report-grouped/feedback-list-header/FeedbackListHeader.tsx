import { useState } from "react";

interface Props {
  viewMode: "flat" | "chrono" | "filtered";
  onChange: (mode: "flat" | "chrono" | "filtered") => void;
  activeTab: "report" | "coupdecoeur" | "suggestion";
}

const FeedbackListHeader = ({ viewMode, onChange, activeTab }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (activeTab !== "report") return null;

  const handleDisplayChange = (mode: "flat" | "chrono") => {
    onChange(mode);
    setShowDropdown(false);
  };

  return (
    <div className="view-toggle">
      {/* Dropdown fusionné */}
      <div className="dropdown-container">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`dropdown-toggle ${
            ["flat", "chrono"].includes(viewMode) ? "active" : ""
          }`}
        >
          {viewMode === "chrono" ? "Tri par date" : "Vue simple"}
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button
              className={viewMode === "flat" ? "active" : ""}
              onClick={() => handleDisplayChange("flat")}
            >
              Vue simple
            </button>
            <button
              className={viewMode === "chrono" ? "active" : ""}
              onClick={() => handleDisplayChange("chrono")}
            >
              Tri par date
            </button>
          </div>
        )}
      </div>

      {/* Bouton de filtre */}
      <button
        className={viewMode === "filtered" ? "active" : ""}
        onClick={() => onChange("filtered")}
      >
        Filtrer
      </button>
    </div>
  );
};

export default FeedbackListHeader;

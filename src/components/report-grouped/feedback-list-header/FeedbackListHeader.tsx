import { useState } from "react";
import tri from "../../../assets/icons/tri-croissant.png";
import { ChevronDown } from "lucide-react";

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

  const getCurrentSortLabel = () => {
    switch (viewMode) {
      case "chrono":
        return "Date";
      case "flat":
        return "Marques";
      default:
        return "Marques";
    }
  };

  return (
    <div className="view-toggle">
      {/* Dropdown avec icône */}
      <div className="dropdown-container">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="dropdown-toggle"
        >
          <img className="sort-icon" src={tri} alt="tri" />
          <strong>Trier par : </strong>
          {getCurrentSortLabel()}
          <span className="chevron">
            <ChevronDown size={16} />
          </span>
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button
              className={viewMode === "flat" ? "active" : ""}
              onClick={() => handleDisplayChange("flat")}
            >
              Marques
            </button>
            <button
              className={viewMode === "chrono" ? "active" : ""}
              onClick={() => handleDisplayChange("chrono")}
            >
              Date
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
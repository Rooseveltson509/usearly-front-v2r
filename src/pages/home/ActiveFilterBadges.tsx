import { Tag, Folder } from "lucide-react";

interface Props {
  selectedBrand: string;
  selectedCategory: string;
  onClearBrand: () => void;
  onClearCategory: () => void;
}

const ActiveFilterBadges: React.FC<Props> = ({
  selectedBrand,
  selectedCategory,
  onClearBrand,
  onClearCategory,
}) => {
  return (
    <div className="active-filters">
      {selectedBrand && (
        <span className="active-filter-badge">
          <Tag size={14} style={{ marginRight: "4px" }} />
          {selectedBrand}
          <span className="close-icon" onClick={onClearBrand}>
            ×
          </span>
        </span>
      )}
      {selectedCategory && (
        <span className="active-filter-badge">
          <Folder size={14} style={{ marginRight: "4px" }} />
          {selectedCategory}
          <span className="close-icon" onClick={onClearCategory}>
            ×
          </span>
        </span>
      )}
    </div>
  );
};

export default ActiveFilterBadges;

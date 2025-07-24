import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { getBrandLogo } from "@src/utils/brandLogos";
import type { UserGroupedReport } from "@src/types/Reports";

interface Props {
  sub: UserGroupedReport;
  brand: string;
  siteUrl: string;
  expandedSub: string | null;
  onToggle: (subCategory: string) => void;
  getFullAvatarUrl: (url: string | null) => string;
}

const SubcategoryHeader: React.FC<Props> = ({
  sub,
  brand,
  siteUrl,
  expandedSub,
  onToggle,
  getFullAvatarUrl,
}) => {
  const isExpanded = expandedSub === sub.subCategory;
  const initialDescription = sub.descriptions[0];

  return (
    <div
      className="subcategory-header"
      onClick={() => onToggle(sub.subCategory)}
    >
      <div className="subcategory-left">
        <img
          src={getCategoryIconPathFromSubcategory(sub.subCategory)}
          alt={sub.subCategory}
          className="subcategory-icon"
        />
        <h4>{sub.subCategory}</h4>
      </div>

      <div className="subcategory-right">
        {!isExpanded && <div className="badge-count">{sub.count}</div>}
        {!isExpanded && (
          <span className="date-subcategory">
            {formatDistanceToNow(new Date(initialDescription.createdAt), {
              locale: fr,
              addSuffix: true,
            }).replace("environ ", "")}
          </span>
        )}

        {isExpanded && (
          <div className="subcategory-user-brand-info">
            <div className="avatars-row">
              <img
                src={getFullAvatarUrl(initialDescription.user.avatar)}
                alt="avatar"
                className="avatar user-avatar"
              />
              <img
                src={getBrandLogo(brand, siteUrl)}
                alt={brand}
                className="avatar brand-logo"
              />
            </div>
            <div className="user-brand-names">
              {initialDescription.user.pseudo} <span className="x">×</span>{" "}
              <strong>{brand}</strong>
            </div>
          </div>
        )}

        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
    </div>
  );
};

export default SubcategoryHeader;

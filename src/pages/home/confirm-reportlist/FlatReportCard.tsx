import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { getBrandLogo } from "@src/utils/brandLogos";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { useAuth } from "@src/services/AuthContext";
import "./FlatReportCard.scss";

interface Props {
  marque: string;
  subCategory: {
    subCategory: string;
    count: number;
    descriptions: {
      id: string;
      createdAt: string;
    }[];
  };
}

const FlatReportCard: React.FC<Props> = ({ marque, subCategory }) => {
  const [expanded, setExpanded] = useState(false);
  const { userProfile } = useAuth();
  const description = subCategory.descriptions[0];

  if (!description) return null;

  return (
    <div className={`flat-report-card ${expanded ? "open" : ""}`}>
      <div className="card-header" onClick={() => setExpanded((prev) => !prev)}>
        <div className="left">
          <img
            src={getCategoryIconPathFromSubcategory(subCategory.subCategory)}
            alt=""
            className="icon"
          />
          <h4>{subCategory.subCategory}</h4>
        </div>

        <div className="right">
          <span className="count-badge">{subCategory.count}</span>
          <span className="date">
            {formatDistanceToNow(new Date(description.createdAt), {
              locale: fr,
              addSuffix: true,
            }).replace("environ ", "")}
          </span>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && (
        <div className="card-body">
          <DescriptionCommentSection
            descriptionId={description.id}
            userId={userProfile?.id || ""}
            type="report"
          />

          <ReportActionsBarWithReactions
            userId={userProfile?.id || ""}
            descriptionId={description.id}
            reportsCount={subCategory.count}
            commentsCount={0}
            onReactClick={() => {}}
            onCommentClick={() => {}}
          />
        </div>
      )}
    </div>
  );
};

export default FlatReportCard;

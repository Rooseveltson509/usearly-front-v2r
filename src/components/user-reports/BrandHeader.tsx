import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown } from "lucide-react";

interface Props {
  brand: string;
  siteUrl: string;
  logoUrl: string;
  reportCount: number;
  mostRecentDate: Date | null;
  onToggle: () => void;
}

const BrandHeader: React.FC<Props> = ({
  brand,
  /*  siteUrl, */
  logoUrl,
  reportCount,
  mostRecentDate,
  onToggle,
}) => {
  return (
    <div className="brand-header" onClick={onToggle}>
      <p className="brand-reports-count">
        <strong>{reportCount}</strong> signalement{reportCount > 1 ? "s" : ""}{" "}
        sur <strong>{brand}</strong>
      </p>
      <p className="date-card">
        {mostRecentDate
          ? `Il y a ${formatDistanceToNow(mostRecentDate, { locale: fr })}`
          : "Date inconnue"}
      </p>
      <img src={logoUrl} alt={brand} className="brand-logo" />
      <ChevronDown size={18} className="chevron-icon" />
    </div>
  );
};

export default BrandHeader;

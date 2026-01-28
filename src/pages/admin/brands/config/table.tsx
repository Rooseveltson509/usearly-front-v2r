import { truncate } from "@src/utils/stringUtils";
import goToUser from "/assets/dashboardUser/goToUser.svg";
import bigUofUsearly from "/assets/icons/bigUofUsearly.svg";
import { type AdminBrand } from "@src/services/adminService";
import {
  formatLastAction,
  getBrandLastActionDays,
  getBrandSector,
  getOfferVariant,
} from "../../../../utils/brandFilters";
import { type DataTableColumn } from "@src/components/dashboard/components/DataTable";

type StatutLabel =
  | "true"
  | "false"
  | "actif"
  | "suspendu"
  | "supprimé"
  | "non_confirmé";

const STATUS_EMOJI: Record<StatutLabel, "🟢" | "🟡" | "🔴" | "⚪"> = {
  true: "🟢",
  false: "🔴",
  actif: "🟢",
  suspendu: "🟡",
  supprimé: "🔴",
  non_confirmé: "⚪",
};

const HEADER_CLASS = "brand-feed-table-head-title-value";
const CELL_CLASS = "brand-feed-table-body-line-data";

export const createAdminBrandsColumns = (
  onNavigate: (brandId: string) => void,
  maxMember: number,
): DataTableColumn<AdminBrand>[] => [
  {
    key: "logo",
    header: "Logo",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => (
      <div className="brand-feed-table-body-line-data-avatar">
        {/* <Avatar
          avatar={brand.logo || null}
          pseudo={brand.name}
          siteUrl={brand.domain}
          sizeHW={50}
          type="brand"
        /> */}
        {brand.logo ? (
          <img
            className="brand-feed-table-body-line-data-avatar-avatar"
            src={brand.logo}
            alt={brand.name}
          />
        ) : (
          <div className="brand-feed-table-body-line-data-avatar-avatar no-avatar">
            {brand.name[0]}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "name",
    header: "Nom Marque",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => (
      <div className="brand-feed-table-body-line-data-pseudo">
        <span title={brand.name}>{truncate(brand.name, 20)}</span>
      </div>
    ),
  },
  {
    key: "sector",
    header: "Secteur",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => {
      const brandSector = getBrandSector(brand);
      return (
        <div className="brand-feed-table-body-line-data-secteur">
          <span title={brand.name}>{brandSector}</span>
        </div>
      );
    },
  },
  {
    key: "domain",
    header: "URL",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-domain">
          {brand.domain}
        </span>
      </div>
    ),
  },
  {
    key: "usearScore",
    header: "UsearScore",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: () => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-up">
          {Math.floor(Math.random() * 1000)}
          <img
            src={bigUofUsearly}
            width={15}
            height={15}
            alt="usearScore logo"
          />
        </span>
      </div>
    ),
  },
  {
    key: "feedbacks",
    header: "Feedbacks",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: () => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-feedbacks">
          {Math.floor(Math.random() * 10000)}
        </span>
      </div>
    ),
  },
  {
    key: "tickets",
    header: "Tickets Ouverts",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: () => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-ticket-open">
          {Math.floor(Math.random() * 100)}
        </span>
      </div>
    ),
  },
  {
    key: "lastAction",
    header: "Dernière action",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => {
      const lastActionDays = getBrandLastActionDays(brand);
      const lastActionDisplay = formatLastAction(lastActionDays);
      return (
        <div className="brand-feed-table-body-line-data">
          <span className="brand-feed-table-body-line-data-last-action">
            {lastActionDisplay}
          </span>
        </div>
      );
    },
  },
  {
    key: "statut",
    header: "Statut",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => (
      <div className="brand-feed-table-body-line-data-statut">
        {STATUS_EMOJI[brand.isActive ? "true" : "false"]}
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => {
      const offerVariant = getOfferVariant(brand.offres);
      return (
        <div className="brand-feed-table-body-line-data-plan">
          <span
            className={`brand-offer-badge brand-offer-badge--${offerVariant}`}
          >
            {brand.offres}
          </span>
        </div>
      );
    },
  },
  {
    key: "members",
    header: "Membres actifs",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: () => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-last-actif-member">
          {Math.floor(Math.random() * maxMember)}/{maxMember}
        </span>
      </div>
    ),
  },
  {
    key: "action",
    header: "",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (brand) => (
      <div className="brand-feed-table-body-line-data">
        <span className="brand-feed-table-body-line-data-action">
          <img
            src={goToUser}
            alt="Voir l'utilisateur"
            onClick={() => onNavigate(brand.id)}
            style={{ cursor: "pointer" }}
          />
        </span>
      </div>
    ),
  },
];

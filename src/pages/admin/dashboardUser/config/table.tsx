import Avatar from "@src/components/shared/Avatar";
import { getContributorStyle } from "@src/services/contributorBadge";
import goToUser from "/assets/dashboardUser/goToUser.svg";
import CellTooltip from "@src/pages/admin/dashboardUser/components/ToolTip/CellTooltip";
import { type StatutLabel } from "@src/types/Filters";
import { type UserRow } from "@src/types/Filters";
import {
  ageFromBirthdateISO,
  genderShort,
  tooltipLabel,
  truncateLabel,
} from "../utils/userTableUtils";
import { type DataTableColumn } from "@src/components/dashboard/components/DataTable";

const STATUS_EMOJI: Record<StatutLabel, "🟢" | "🟡" | "🔴" | "⚪"> = {
  actif: "🟢",
  suspendu: "🟡",
  supprimé: "🔴",
  non_confirmé: "⚪",
};

const HEADER_CLASS = "feed-table-head-title-value";
const CELL_CLASS = "feed-table-body-line-data";

export const createDashboardUserColumns = (
  onNavigate: (userId: string) => void,
): DataTableColumn<UserRow>[] => [
  {
    key: "avatar",
    header: "Avatar",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={`Profil de ${user.pseudo}`}>
        <div className="feed-table-body-line-data-avatar">
          <Avatar
            avatar={user.avatar || null}
            pseudo={user.pseudo}
            sizeHW={45}
          />
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "statut",
    header: "Statut",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Statut", user.statut)}>
        <div className="feed-table-body-line-data-statut">
          {STATUS_EMOJI[user.statut]}
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "pseudo",
    header: "Pseudo",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Pseudo", user.pseudo)}>
        <div className="feed-table-body-line-data-pseudo">
          <span title={user.pseudo}>{truncateLabel(user.pseudo, 20)}</span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "gender",
    header: "Sexe",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Sexe", user.gender)}>
        <div className="feed-table-body-line-data-gender">
          <span>{genderShort(user.gender)}</span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "age",
    header: "Age",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => {
      const age = ageFromBirthdateISO(user.birthdateISO);
      return (
        <CellTooltip tooltip={tooltipLabel("Âge", age)}>
          <div className="feed-table-body-line-data">
            <span className="feed-table-body-line-data-age">{age}</span>
          </div>
        </CellTooltip>
      );
    },
  },
  {
    key: "email",
    header: "Email",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Email", user.email)}>
        <div className="feed-table-body-line-data">
          <span className="feed-table-body-line-data-email" title={user.email}>
            {truncateLabel(user.email, 20)}
          </span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "feedbacks",
    header: "Feedbacks",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Feedbacks", user.feedbacks)}>
        <div className="feed-table-body-line-data">
          <span className="feed-table-body-line-data-feedbacks">
            {user.feedbacks}
          </span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "marques",
    header: "Marques",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Marques", user.marques)}>
        <div className="feed-table-body-line-data">
          <span className="feed-table-body-line-data-brand">
            {user.marques}
          </span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "up",
    header: "Up",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={tooltipLabel("Up", user.up)}>
        <div className="feed-table-body-line-data">
          <span className="feed-table-body-line-data-up">{user.up}</span>
        </div>
      </CellTooltip>
    ),
  },
  {
    key: "contributeur",
    header: "Contributeur",
    thClassName: HEADER_CLASS,
    tdClassName: `${CELL_CLASS} feed-table-body-line-data-big-parent-contributor`,
    render: (user) => {
      const contribStyle = getContributorStyle(user.contributeur.toLowerCase());
      return (
        <CellTooltip tooltip={tooltipLabel("Contributeur", user.contributeur)}>
          <div className="feed-table-body-line-data feed-table-body-line-data-parent-contributor">
            <span
              className={`feed-table-body-line-data-contributeur ${contribStyle.className}`}
            >
              {user.contributeur}
            </span>
          </div>
        </CellTooltip>
      );
    },
  },
  {
    key: "action",
    header: "",
    thClassName: HEADER_CLASS,
    tdClassName: CELL_CLASS,
    render: (user) => (
      <CellTooltip tooltip={`Voir ${user.pseudo}`}>
        <div className="feed-table-body-line-data">
          <span className="feed-table-body-line-data-action">
            <img
              src={goToUser}
              alt="Voir l'utilisateur"
              onClick={() => onNavigate(user.id)}
              style={{ cursor: "pointer" }}
            />
          </span>
        </div>
      </CellTooltip>
    ),
  },
];

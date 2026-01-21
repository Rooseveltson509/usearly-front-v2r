import Avatar from "@src/components/shared/Avatar";
import goToUser from "/assets/dashboardUser/goToUser.svg";
import { getContributorStyle } from "@src/services/contributorBadge";
import { TooltipProvider } from "@src/components/ui/tooltip";
import CellTooltip from "@src/pages/dashboardUser/components/ToolTip/CellTooltip";
import "./feed.scss";

type UserRow = {
  id: string;
  avatar?: string | null;
  contributeur: string;
  birthdateISO: string;
  statut: StatutLabel;
  pseudo: string;
  gender: string;
  email: string;
  feedbacks: number;
  marques: number;
  up: number;
};

type StatutLabel = "actif" | "suspendu" | "supprimé";

const STATUS_EMOJI: Record<StatutLabel, "🟢" | "🟡" | "🔴"> = {
  actif: "🟢",
  suspendu: "🟡",
  supprimé: "🔴",
};

function genderShort(gender: string): string {
  return gender !== "non Spécifié" ? gender.slice(0, 1) : "NS";
}

function ageFromBirthdateISO(iso: string): number {
  const birth = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (hasNotHadBirthdayThisYear) age--;
  return age;
}

function truncate(value: string, max: number): string {
  if (!value) return "";
  if (value.length <= max) return value;
  const safe = Math.max(0, max - 1);
  return value.slice(0, safe) + "…";
}

const tooltipLabel = (label: string, value: string | number) =>
  `${label}: ${value}`;

const Feed = ({ users }: { users: UserRow[] }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="feed-table-container">
        <table className="feed-table">
          <thead className="feed-table-head">
            <tr className="feed-table-head-title">
              <th className="feed-table-head-title-value">Avatar</th>
              <th className="feed-table-head-title-value">Statut</th>
              <th className="feed-table-head-title-value">Pseudo</th>
              <th className="feed-table-head-title-value">Sexe</th>
              <th className="feed-table-head-title-value">Age</th>
              <th className="feed-table-head-title-value">Email</th>
              <th className="feed-table-head-title-value">Feedbacks</th>
              <th className="feed-table-head-title-value">Marques</th>
              <th className="feed-table-head-title-value">Up</th>
              <th className="feed-table-head-title-value">Contributeur</th>
              <th className="feed-table-head-title-value"></th>
            </tr>
          </thead>
          <tbody className="feed-table-body">
            {users.map((user, index) => {
              const contribStyle = getContributorStyle(
                user.contributeur.toLowerCase(),
              );
              const age = ageFromBirthdateISO(user.birthdateISO);
              return (
                <tr
                  key={`${user.id}-${index}`}
                  className="feed-table-body-line"
                >
                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={`Profil de ${user.pseudo}`}>
                      <div className="feed-table-body-line-data-avatar">
                        <Avatar avatar={user.avatar || null} sizeHW={45} />
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Statut", user.statut)}>
                      <div className="feed-table-body-line-data-statut">
                        {STATUS_EMOJI[user.statut]}
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Pseudo", user.pseudo)}>
                      <div className="feed-table-body-line-data-pseudo">
                        <span title={user.pseudo}>
                          {truncate(user.pseudo, 20)}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Sexe", user.gender)}>
                      <div className="feed-table-body-line-data-gender">
                        <span>{genderShort(user.gender)}</span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Âge", age)}>
                      <div className="feed-table-body-line-data">
                        <span className="feed-table-body-line-data-age">
                          {age}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Email", user.email)}>
                      <div className="feed-table-body-line-data">
                        <span
                          className="feed-table-body-line-data-email"
                          title={user.email}
                        >
                          {truncate(user.email, 20)}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip
                      tooltip={tooltipLabel("Feedbacks", user.feedbacks)}
                    >
                      <div className="feed-table-body-line-data">
                        <span className="feed-table-body-line-data-feedbacks">
                          {user.feedbacks}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip
                      tooltip={tooltipLabel("Marques", user.marques)}
                    >
                      <div className="feed-table-body-line-data">
                        <span className="feed-table-body-line-data-brand">
                          {user.marques}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={tooltipLabel("Up", user.up)}>
                      <div className="feed-table-body-line-data">
                        <span className="feed-table-body-line-data-up">
                          {user.up}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data feed-table-body-line-data-big-parent-contributor">
                    <CellTooltip
                      tooltip={tooltipLabel("Contributeur", user.contributeur)}
                    >
                      <div className="feed-table-body-line-data feed-table-body-line-data-parent-contributor">
                        <span
                          className={`feed-table-body-line-data-contributeur ${contribStyle.className}`}
                        >
                          {user.contributeur}
                        </span>
                      </div>
                    </CellTooltip>
                  </td>

                  <td className="feed-table-body-line-data">
                    <CellTooltip tooltip={`Voir ${user.pseudo}`}>
                      <div className="feed-table-body-line-data">
                        <span className="feed-table-body-line-data-action">
                          <img src={goToUser} alt="Voir l'utilisateur" />
                        </span>
                      </div>
                    </CellTooltip>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr className="feed-table-body-line feed-table-body-line--empty">
                <td colSpan={11} className="feed-table-body-line-data">
                  <div className="feed-table-body-line-data">
                    <span className="feed-table-body-line-data-empty">
                      Aucun utilisateur
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};

export default Feed;

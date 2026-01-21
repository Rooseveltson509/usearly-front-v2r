import DashboardUserHeader from "@src/pages/dashboardUser/components/header/DashboardUserHeader.tsx";
import DashboardFilter from "@src/pages/dashboardUser/components/filters/DashboardFilter.tsx";
import Feed from "@src/pages/dashboardUser/components/feed/Feed.tsx";

import "./DashboardUser.scss";

import { useState, useMemo, useEffect } from "react";

type UserRow = {
  id: string;
  avatar: string | null;
  statut: StatutLabel;
  pseudo: string;
  gender: string;
  birthdateISO: string; // "YYYY-MM-DD"
  email: string;
  feedbacks: number;
  marques: number;
  up: number;
  contributeur: ContributorLabel;
};

type StatutLabel = "actif" | "suspendu" | "supprimé";
type ContributorLabel =
  | "Porteur d'idées"
  | "Explorateur de bugs"
  | "Ambassadeur"
  | "Polycontributeur";
type UpRange = "inf-10" | "10-30" | "30-50" | "sup-50" | "";

const UP_RANGE_BOUNDARIES: Record<
  Exclude<UpRange, "">,
  { min?: number; max?: number }
> = {
  "inf-10": { max: 10 },
  "10-30": { min: 10, max: 30 },
  "30-50": { min: 30, max: 50 },
  "sup-50": { min: 50 },
};

const isInUpRange = (value: number, range: UpRange) => {
  if (!range) {
    return true;
  }
  const bounds = UP_RANGE_BOUNDARIES[range];
  if (!bounds) {
    return true;
  }
  if (bounds.min !== undefined && value < bounds.min) {
    return false;
  }
  if (bounds.max !== undefined && value > bounds.max) {
    return false;
  }
  return true;
};

const SAMPLE_USERS: UserRow[] = [
  {
    id: "u1",
    avatar: null,
    statut: "actif",
    pseudo: "Utilisateur123",
    gender: "Masculin",
    birthdateISO: "2001-06-15",
    email: "xizeucappoddau-3596@yopmail.fr",
    feedbacks: 42,
    marques: 7,
    up: 15,
    contributeur: "Porteur d'idées",
  },
  {
    id: "u2",
    avatar: null,
    statut: "suspendu",
    pseudo: "AnnaB",
    gender: "Féminin",
    birthdateISO: "1997-11-02",
    email: "annaadibazidubaziudbziaubsdqjdbzaliudbsqdazvbidaiuzbdb@example.com",
    feedbacks: 12,
    marques: 3,
    up: 4,
    contributeur: "Explorateur de bugs",
  },
  {
    id: "u3",
    avatar: null,
    statut: "supprimé",
    pseudo: "Neo",
    gender: "non Spécifié",
    birthdateISO: "1990-01-20",
    email: "neo@example.com",
    feedbacks: 5,
    marques: 1,
    up: 0,
    contributeur: "Ambassadeur",
  },
];

const DashboardUser = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [query, setQuery] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<StatutLabel[]>([]);
  const [selectedContributorTypes, setSelectedContributorTypes] = useState<
    ContributorLabel[]
  >([]);
  const [selectedUpRange, setSelectedUpRange] = useState<UpRange>("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(1);
    setUsers(SAMPLE_USERS);
  }, []);

  const normalize = (string: string) =>
    string
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredUsers = useMemo(() => {
    const querys = normalize(query.trim());
    return users.filter((user) => {
      const queryUser =
        normalize(user.pseudo).includes(querys) ||
        normalize(user.email).includes(querys);
      const statutUser =
        selectedStatut.length === 0 || selectedStatut.includes(user.statut);
      const contributorUser =
        selectedContributorTypes.length === 0 ||
        selectedContributorTypes.includes(user.contributeur);
      const upRangeUser = isInUpRange(user.up, selectedUpRange);
      return queryUser && statutUser && contributorUser && upRangeUser;
    });
  }, [users, query, selectedStatut, selectedContributorTypes, selectedUpRange]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const PAGE_SIZE = 6;

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  return (
    <div className="dashboard-user-page">
      <DashboardUserHeader />
      <DashboardFilter
        value={query}
        selectedStatuts={selectedStatut}
        selectedContributors={selectedContributorTypes}
        selectedUpRange={selectedUpRange}
        onChange={setQuery}
        onStatutChange={setSelectedStatut}
        onContributorChange={setSelectedContributorTypes}
        onUpRangeChange={setSelectedUpRange}
      />
      <Feed users={filteredUsers} />
      <div className="feed-table-body-page">
        <div className="feed-table-body-page-button">
          <h3>Page précédente</h3>
        </div>
        <div className="feed-table-body-page-location">
          <span className="feed-table-body-page-location-text">Page</span>{" "}
          {page}/{totalPages}
        </div>
        <div className="feed-table-body-page-button">
          <h3>Page suivante</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;

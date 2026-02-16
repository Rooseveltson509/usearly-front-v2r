export type FilterType =
  | ""
  | "hot"
  | "rage"
  | "popular"
  | "confirmed"
  | "urgent"
  | "chrono";

export type OfferVariant = "freemium" | "start" | "premium" | "unknown";
export type LastActionRange = "0-2j" | "+2j" | "+1semaine" | "+1mois" | "";

export type AdminBrandsFiltersState = {
  plans: OfferVariant[];
  sectors: string[];
  lastAction: LastActionRange;
};

export type FilterOption<T extends string = string> = {
  label: string;
  value: T;
};

export type AdminBrandsFilterConfigItem = {
  key: keyof AdminBrandsFiltersState;
  label: string;
  type: "multi" | "single";
  options: FilterOption[];
  defaultValue: AdminBrandsFiltersState[keyof AdminBrandsFiltersState];
  backendKey: string;
};

export const PLAN_OPTIONS: FilterOption<OfferVariant>[] = [
  { label: "Freemium", value: "freemium" },
  { label: "start", value: "start" },
  { label: "Premium", value: "premium" },
];

/* export const SECTOR_OPTIONS: FilterOption<string>[] = [
  "E-commerce",
  "SaaS",
  "Education",
  "Santé",
  "Finance",
].map((value) => ({ label: value, value })); */

export const LAST_ACTION_OPTIONS: FilterOption<LastActionRange>[] = [
  { label: "0-2j", value: "0-2j" },
  { label: "+2j", value: "+2j" },
  { label: "+1semaine", value: "+1semaine" },
  { label: "+1mois", value: "+1mois" },
];

export const ADMIN_BRANDS_FILTER_DEFAULTS: AdminBrandsFiltersState = {
  plans: [],
  sectors: [],
  lastAction: "",
};

export const ADMIN_BRANDS_FILTER_CONFIG: AdminBrandsFilterConfigItem[] = [
  {
    key: "plans",
    label: "Plan",
    type: "multi",
    options: PLAN_OPTIONS,
    defaultValue: ADMIN_BRANDS_FILTER_DEFAULTS.plans,
    backendKey: "plan",
  },
  {
    key: "sectors",
    label: "Secteur",
    type: "multi",
    options: [],
    defaultValue: ADMIN_BRANDS_FILTER_DEFAULTS.sectors,
    backendKey: "sector",
  },
  {
    key: "lastAction",
    label: "Dernière action",
    type: "single",
    options: LAST_ACTION_OPTIONS,
    defaultValue: ADMIN_BRANDS_FILTER_DEFAULTS.lastAction,
    backendKey: "lastAction",
  },
];

export type StatutLabel = "actif" | "suspendu" | "supprimé" | "non_confirmé";
export type ContributorLabel =
  | "Porteur d'idées"
  | "Explorateur de bugs"
  | "Ambassadeur"
  | "Polycontributeur";

export type UpRange = "inf-10" | "10-30" | "30-50" | "sup-50" | "";
export type GenderLabel = "H" | "F" | "NA";
export type AgeRange = "-18" | "18-25" | "26-40" | "41-55" | "55+" | "";
export type BrandCountRange = "1" | "2-3" | "4+" | "";

export type DashboardUserFiltersState = {
  statut: StatutLabel[];
  contributor: ContributorLabel[];
  upRange: UpRange;
  gender: GenderLabel[];
  ageRange: AgeRange;
  brandCount: BrandCountRange;
};

export type DashboardUserFilterConfigItem = {
  key: keyof DashboardUserFiltersState;
  label: string;
  type: "multi" | "single";
  options: FilterOption[];
  defaultValue: DashboardUserFiltersState[keyof DashboardUserFiltersState];
  group: "primary" | "more";
  backendKey: string;
};

export const DASHBOARD_USER_FILTER_DEFAULTS: DashboardUserFiltersState = {
  statut: [],
  contributor: [],
  upRange: "",
  gender: [],
  ageRange: "",
  brandCount: "",
};

const ALL_STATUSES: StatutLabel[] = [
  "actif",
  "suspendu",
  "supprimé",
  "non_confirmé",
];

const ALL_CONTRIBUTOR_TYPES: ContributorLabel[] = [
  "Porteur d'idées",
  "Explorateur de bugs",
  "Ambassadeur",
  "Polycontributeur",
];

export const DASHBOARD_USER_UP_RANGE_LABELS: Record<
  Exclude<UpRange, "">,
  string
> = {
  "inf-10": "Inférieur à 10",
  "10-30": "Entre 10 et 30",
  "30-50": "Entre 30 et 50",
  "sup-50": "Superieur à 50",
};

export const DASHBOARD_USER_AGE_RANGE_LABELS: Record<
  Exclude<AgeRange, "">,
  string
> = {
  "-18": "-18",
  "18-25": "18-25",
  "26-40": "26-40",
  "41-55": "41-55",
  "55+": "55+",
};

export const DASHBOARD_USER_BRAND_COUNT_LABELS: Record<
  Exclude<BrandCountRange, "">,
  string
> = {
  "1": "1",
  "2-3": "2-3",
  "4+": "4+",
};

export const DASHBOARD_USER_STATUS_COLORS: Record<StatutLabel, string> = {
  actif: "#22c55e",
  suspendu: "#facc15",
  supprimé: "#ef4444",
  non_confirmé: "#ffffff",
};

export const DASHBOARD_USER_CONTRIBUTOR_COLORS: Record<
  ContributorLabel,
  string
> = {
  "Porteur d'idées": "#C253F120",
  "Explorateur de bugs": "#4C6BF620",
  Ambassadeur: "#FF282C20",
  Polycontributeur: "#32D27520",
};

export const DASHBOARD_USER_PRIMARY_FILTERS: DashboardUserFilterConfigItem[] = [
  {
    key: "statut",
    label: "Statut",
    type: "multi",
    options: ALL_STATUSES.map((value) => ({ label: value, value })),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.statut,
    group: "primary",
    backendKey: "statut",
  },
  {
    key: "contributor",
    label: "Contributeurs",
    type: "multi",
    options: ALL_CONTRIBUTOR_TYPES.map((value) => ({ label: value, value })),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.contributor,
    group: "primary",
    backendKey: "contributor",
  },
  {
    key: "upRange",
    label: "UP",
    type: "single",
    options: Object.entries(DASHBOARD_USER_UP_RANGE_LABELS).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.upRange,
    group: "primary",
    backendKey: "up",
  },
];

export const DASHBOARD_USER_MORE_FILTERS: DashboardUserFilterConfigItem[] = [
  {
    key: "gender",
    label: "Sexe",
    type: "multi",
    options: ["H", "F", "NA"].map((value) => ({ label: value, value })),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.gender,
    group: "more",
    backendKey: "gender",
  },
  {
    key: "ageRange",
    label: "Tranche d'âge",
    type: "single",
    options: Object.entries(DASHBOARD_USER_AGE_RANGE_LABELS).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.ageRange,
    group: "more",
    backendKey: "age",
  },
  {
    key: "brandCount",
    label: "Nombre de marques",
    type: "single",
    options: Object.entries(DASHBOARD_USER_BRAND_COUNT_LABELS).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
    defaultValue: DASHBOARD_USER_FILTER_DEFAULTS.brandCount,
    group: "more",
    backendKey: "brands",
  },
];

export const DASHBOARD_USER_FILTER_CONFIG: DashboardUserFilterConfigItem[] = [
  ...DASHBOARD_USER_PRIMARY_FILTERS,
  ...DASHBOARD_USER_MORE_FILTERS,
];

export type UserRow = {
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

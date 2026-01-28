import {
  type AgeRange,
  type BrandCountRange,
  type DashboardUserFiltersState,
  type GenderLabel,
  type UpRange,
  type UserRow,
} from "@src/types/Filters";

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
  if (!range) return true;
  const bounds = UP_RANGE_BOUNDARIES[range];
  if (!bounds) return true;
  if (bounds.min !== undefined && value < bounds.min) return false;
  if (bounds.max !== undefined && value > bounds.max) return false;
  return true;
};

const normalizeGender = (value?: string | null): GenderLabel => {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (!normalized) return "NA";
  if (normalized.startsWith("h") || normalized.startsWith("m")) return "H";
  if (normalized.startsWith("f")) return "F";
  return "NA";
};

const getAgeFromBirthdate = (birthdateISO?: string | null) => {
  if (!birthdateISO) return null;
  const timestamp = Date.parse(birthdateISO);
  if (Number.isNaN(timestamp)) return null;
  const today = new Date();
  const birthdate = new Date(timestamp);
  let age = today.getFullYear() - birthdate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() &&
      today.getDate() >= birthdate.getDate());
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
};

const isInAgeRange = (age: number | null, range: AgeRange) => {
  if (!range) return true;
  if (age === null) return false;
  if (range === "-18") return age < 18;
  if (range === "18-25") return age >= 18 && age <= 25;
  if (range === "26-40") return age >= 26 && age <= 40;
  if (range === "41-55") return age >= 41 && age <= 55;
  if (range === "55+") return age >= 55;
  return true;
};

const isInBrandCountRange = (value: number, range: BrandCountRange) => {
  if (!range) return true;
  if (range === "1") return value === 1;
  if (range === "2-3") return value >= 2 && value <= 3;
  if (range === "4+") return value >= 4;
  return true;
};

export const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const filterUsers = (
  users: UserRow[],
  query: string,
  filters: DashboardUserFiltersState,
) => {
  const queryNormalized = normalizeSearchText(query.trim());
  return users.filter((user) => {
    const queryMatch =
      normalizeSearchText(user.pseudo).includes(queryNormalized) ||
      normalizeSearchText(user.email).includes(queryNormalized);
    const statutMatch =
      filters.statut.length === 0 || filters.statut.includes(user.statut);
    const contributorMatch =
      filters.contributor.length === 0 ||
      filters.contributor.includes(user.contributeur);
    const upRangeMatch = isInUpRange(user.up, filters.upRange);
    const genderValue = normalizeGender(user.gender);
    const genderMatch =
      filters.gender.length === 0 || filters.gender.includes(genderValue);
    const ageValue = getAgeFromBirthdate(user.birthdateISO);
    const ageMatch = isInAgeRange(ageValue, filters.ageRange);
    const brandCountMatch = isInBrandCountRange(
      user.marques,
      filters.brandCount,
    );

    return (
      queryMatch &&
      statutMatch &&
      contributorMatch &&
      upRangeMatch &&
      genderMatch &&
      ageMatch &&
      brandCountMatch
    );
  });
};

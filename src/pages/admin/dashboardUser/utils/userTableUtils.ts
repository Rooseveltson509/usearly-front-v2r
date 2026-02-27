export const genderShort = (gender?: string | null): string => {
  if (typeof gender !== "string" || gender.trim() === "") return "NS";

  if (gender === "non Spécifié") return "NS";

  return gender.trim().charAt(0).toUpperCase();
};

export const ageFromBirthdateISO = (iso: string): number => {
  const birth = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (hasNotHadBirthdayThisYear) age--;
  return age;
};

export const truncateLabel = (value: string, max: number): string => {
  if (!value) return "";
  if (value.length <= max) return value;
  const safe = Math.max(0, max - 1);
  return value.slice(0, safe) + "…";
};

export const tooltipLabel = (label: string, value: string | number) =>
  `${label}: ${value}`;

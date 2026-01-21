// Mappe un libellé contributeur à un style de badge (classe + couleurs)
export type ContributorKind =
  | "explorateur de bugs"
  | "porteur d'idées"
  | "ambassadeur"
  | "polycontributeur"
  | "autre";

export type ContributorStyle = {
  kind: ContributorKind;
  className: string;
  bg: string;
};

export function getContributorStyle(label: string): ContributorStyle {
  const kind = label;
  switch (kind) {
    case "explorateur de bugs":
      return {
        kind,
        className: "badge--explorateur",
        bg: "#4C6BF6",
      };
    case "porteur d'idées":
      return {
        kind,
        className: "badge--porteur",
        bg: "#C253F1",
      };
    case "ambassadeur":
      return {
        kind,
        className: "badge--ambassadeur",
        bg: "#FF282C",
      };
    case "polycontributeur":
      return {
        kind,
        className: "badge--polycontributeur",
        bg: "#32D275",
      };
    default:
      return {
        kind: "autre",
        className: "badge--default",
        bg: "#F3F4F6",
      };
  }
}

export type StatutLabel = "actif" | "suspendu" | "supprimé" | "non_confirmé";
export type ContributorLabel =
  | "Porteur d'idées"
  | "Explorateur de bugs"
  | "Ambassadeur"
  | "Polycontributeur";

export const mapStatut = (user: {
  confirmedAt?: string | null;
  expiredAt?: string | null;
  deletedAt?: string | null;
}): StatutLabel => {
  if (user.deletedAt) return "supprimé";
  if (!user.confirmedAt) return "non_confirmé";
  if (user.expiredAt) return "suspendu";
  return "actif";
};

export const mapContributor = (feedbacks: number): ContributorLabel => {
  if (feedbacks >= 30) return "Polycontributeur";
  if (feedbacks >= 20) return "Ambassadeur";
  if (feedbacks >= 10) return "Explorateur de bugs";
  return "Porteur d'idées";
};

export const getInitials = (pseudo: string) => {
  return pseudo
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

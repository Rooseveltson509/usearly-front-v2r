export function genderLabel(value: string) {
  switch (value) {
    case "monsieur":
      return "Homme";
    case "madame":
      return "Femme";
    case "N/A":
      return "Non spécifié";
    default:
      return "Non spécifié";
  }
}

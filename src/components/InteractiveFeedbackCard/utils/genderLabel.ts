export function genderLabel(value: string) {
  switch (value) {
    case "monsieur":
      return "Monsieur";
    case "madame":
      return "Madame";
    default:
      return "Non spécifié";
  }
}

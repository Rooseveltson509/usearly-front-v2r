export const errorMessages: Record<string, string> = {
  REQUIRED_FIELDS: "⚠️ Merci de remplir tous les champs obligatoires.",
  INVALID_BIRTHDATE: "⚠️ La date de naissance est invalide.",
  UNDERAGE: "⚠️ Vous devez être majeur pour vous inscrire.",
  INVALID_PSEUDO: "⚠️ Le pseudo doit contenir 3 à 50 caractères alphanumériques.",
  INVALID_EMAIL: "⚠️ L'adresse email n'est pas valide.",
  INVALID_PASSWORD: "⚠️ Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.",
  PASSWORD_MISMATCH: "⚠️ Les mots de passe ne correspondent pas.",
  ACCOUNT_EXISTS: "⚠️ Ce compte existe déjà.",
  CONFIRMATION_REQUIRED: "⚠️ Ce compte existe mais n'est pas confirmé. Vérifiez vos mails.",
  SERVER_ERROR: "❌ Une erreur interne est survenue. Réessayez plus tard.",
};
export interface PublicSuggestion {
  id: string;
  marque?: string;
  title?: string;
  description?: string;
  emoji?: string;
  siteUrl?: string;
  createdAt?: string | null;
  votes?: number;
  capture?: string | null; // ✅ ajouté
  duplicateCount?: number;
  author?: {
    id: string;
    pseudo: string;
    avatar?: string | null;
  };
}

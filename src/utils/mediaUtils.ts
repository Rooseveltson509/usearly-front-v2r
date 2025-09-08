const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getFullMediaUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}/${path}`;
};
export const getCsrfToken = (): string | null => {
  const match = document.cookie.match(/_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};
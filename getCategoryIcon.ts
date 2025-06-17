export const getCategoryIconPath = (category: string): string => {
  if (!category) return "/assets/categories-icons/other.png";

  const formatted = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-");

  return `/assets/categories-icons/${formatted}.png`;
};

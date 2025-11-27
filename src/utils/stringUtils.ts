export const capitalizeFirstLetter = (text: string | any) => {
  if (!text) return text;
  if (typeof text !== "string") text = String(text);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncate = (s: string, max = 10, ellipsis = "…") =>
  s.length > max ? s.slice(0, max) + ellipsis : s;

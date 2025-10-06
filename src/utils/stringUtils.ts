export const capitalizeFirstLetter = (text: string | any) => {
  if (!text) return text;
  if (typeof text !== "string") text = String(text);
  console.log("text", text);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

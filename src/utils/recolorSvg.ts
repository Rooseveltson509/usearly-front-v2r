const COLOR_ATTRIBUTES = [
  "fill",
  "stroke",
  "stop-color",
  "flood-color",
  "lighting-color",
] as const;

const HEX_PATTERN = /#4E8CFF\b/gi;
const RGB_PATTERN = /rgb\(\s*78\s*,\s*140\s*,\s*255\s*\)/gi;
const RGBA_PATTERN =
  /rgba\(\s*78\s*,\s*140\s*,\s*255\s*,\s*(?:1(?:\.0+)?|100%)\s*\)/gi;

const replaceColorTokens = (value: string, brandColor: string): string =>
  value
    .replace(HEX_PATTERN, brandColor)
    .replace(RGB_PATTERN, brandColor)
    .replace(RGBA_PATTERN, brandColor);

const normalizeBrandColor = (brandColor: string): string => brandColor.trim();

const ensureParserSuccess = (doc: Document, originalSvg: string): void => {
  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) {
    const message = parserError.textContent?.trim() || "Unknown parser error";
    throw new Error(`Unable to parse SVG: ${message}`);
  }
  if (
    !doc.documentElement ||
    doc.documentElement.tagName.toLowerCase() !== "svg"
  ) {
    throw new Error("Parsed markup is not a valid SVG document");
  }
  if (!originalSvg.includes("<svg")) {
    throw new Error("Provided markup does not contain an <svg> element");
  }
};

const processStyleElement = (element: Element, brandColor: string): void => {
  if (!element.textContent) return;
  const updated = replaceColorTokens(element.textContent, brandColor);
  if (updated !== element.textContent) {
    element.textContent = updated;
  }
};

const processTargetAttributes = (
  element: Element,
  brandColor: string,
): void => {
  COLOR_ATTRIBUTES.forEach((attr) => {
    if (!element.hasAttribute(attr)) return;
    const value = element.getAttribute(attr);
    if (!value) return;
    const updated = replaceColorTokens(value, brandColor);
    if (updated !== value) {
      element.setAttribute(attr, updated);
    }
  });
};

const processInlineStyle = (element: Element, brandColor: string): void => {
  const styleValue = element.getAttribute("style");
  if (!styleValue) return;
  const updated = replaceColorTokens(styleValue, brandColor);
  if (updated !== styleValue) {
    element.setAttribute("style", updated);
  }
};

/**
 * Recolor every occurrence of the default Usearly highlight (#4E8CFF) within an SVG string.
 *
 * @param svg - Raw SVG markup as a string.
 * @param brandColor - The color that should replace the default blue.
 * @returns A serialized SVG string with the desired color applied.
 */
export const recolorSvg = (svg: string, brandColor: string): string => {
  if (typeof svg !== "string" || !svg.trim()) {
    throw new Error("An SVG string is required for recolorSvg");
  }

  const normalizedBrandColor = normalizeBrandColor(brandColor);
  if (!normalizedBrandColor) {
    throw new Error("A non-empty brandColor must be provided to recolorSvg");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");

  ensureParserSuccess(doc, svg);

  const elements = doc.getElementsByTagName("*");
  for (const element of Array.from(elements)) {
    processTargetAttributes(element, normalizedBrandColor);
    processInlineStyle(element, normalizedBrandColor);
    if (element.tagName.toLowerCase() === "style") {
      processStyleElement(element, normalizedBrandColor);
    }
  }

  const serialized = new XMLSerializer().serializeToString(doc);
  return serialized;
};

import { recolorSvg } from "./recolorSvg";

/**
 * Tiny manual checks for the recolorSvg helper.
 *
 * Call from a browser console or a storybook to verify that critical cases are covered:
 *
 * ```ts
 * import { runRecolorSvgExamples } from "@src/utils/recolorSvg.examples";
 * runRecolorSvgExamples();
 * ```
 */
export const runRecolorSvgExamples = (
  brandColor: string = "#FF3366",
): boolean => {
  if (typeof DOMParser === "undefined") {
    console.warn(
      "runRecolorSvgExamples requires a DOM environment (DOMParser not available).",
    );
    return false;
  }

  const sampleSvg = `
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <style>
        .cls-1 { fill: #4E8CFF; stroke: rgb(78,140,255); }
        .cls-2 { stop-color: rgb(78, 140, 255); }
      </style>
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stop-color="#4E8CFF"/>
          <stop offset="100%" stop-color="rgba(78,140,255,1)"/>
        </linearGradient>
      </defs>
      <rect
        id="rect-sample"
        class="cls-1"
        x="10"
        y="10"
        width="100"
        height="60"
        fill="#4E8CFF"
        stroke="rgba(78,140,255,1)"
        style="fill:#4E8CFF; stroke:#4E8CFF"
      />
      <circle
        id="circle-sample"
        cx="60"
        cy="90"
        r="18"
        fill="url(#gradient)"
        stroke="#4E8CFF"
      />
    </svg>
  `;

  const recoloredMarkup = recolorSvg(sampleSvg, brandColor);
  const parser = new DOMParser();
  const doc = parser.parseFromString(recoloredMarkup, "image/svg+xml");

  const assertions: Array<[boolean, string]> = [
    [
      doc.getElementById("rect-sample")?.getAttribute("fill") === brandColor,
      "fill attribute should be replaced",
    ],
    [
      doc.getElementById("rect-sample")?.getAttribute("stroke") === brandColor,
      "stroke attribute should be replaced",
    ],
    [
      doc
        .getElementById("rect-sample")
        ?.getAttribute("style")
        ?.includes(`fill:${brandColor}`) ?? false,
      "inline style fill should be replaced",
    ],
    [
      doc
        .getElementById("rect-sample")
        ?.getAttribute("style")
        ?.includes(`stroke:${brandColor}`) ?? false,
      "inline style stroke should be replaced",
    ],
    [
      doc.querySelector('stop[offset="0%"]')?.getAttribute("stop-color") ===
        brandColor,
      "stop-color attribute should be replaced",
    ],
    [
      doc.querySelector('stop[offset="100%"]')?.getAttribute("stop-color") ===
        brandColor,
      "rgba stop-color should become the brand color",
    ],
    [
      doc.querySelector("style")?.textContent?.includes(brandColor) ?? false,
      "<style> block should contain the brand color",
    ],
    [!/#4E8CFF/i.test(recoloredMarkup), "no #4E8CFF occurrences should remain"],
    [
      !/rgb\s*\(\s*78\s*,\s*140\s*,\s*255\s*\)/i.test(recoloredMarkup),
      "no rgb(78,140,255) occurrences should remain",
    ],
  ];

  const failed = assertions.filter(([ok]) => !ok);

  if (failed.length > 0) {
    failed.forEach(([, message]) => {
      console.error(`[recolorSvg] ${message}`);
    });
    return false;
  }

  console.info("[recolorSvg] All manual examples passed ✅");
  return true;
};

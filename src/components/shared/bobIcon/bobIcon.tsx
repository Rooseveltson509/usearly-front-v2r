import React, { useEffect, useMemo, useState } from "react";
import "./bobIcon.scss";
import { useColorBrand } from "@src/pages/home/hooks/useColorBrand";

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string };

interface BobIconProps {
  iconName: string; // ex: "popcorn"
  category: string; // ex: "food_drink"
  brand: string; // ex: "netflix"
}

const directoryBobCategory = [
  "bancaire",
  "ecommerce",
  "general",
  "tv_cinema",
  "culture_musique",
  "food_drink",
  "hotelerie_immobilier",
  "sport",
  "voyage_transport",
] as const;

const BobIcon: React.FC<BobIconProps> = ({ iconName, brand, category }) => {
  const [svgMarkup, setSvgMarkup] = useState<string>("");

  // 1) chemin du SVG
  const src = useMemo(() => {
    const normCat = (category || "").toLowerCase();
    const isKnown = (directoryBobCategory as readonly string[]).includes(
      normCat as any,
    );
    const dir = isKnown ? normCat : "general";
    const file = isKnown ? `${iconName || "default"}.svg` : "default.svg";
    return `/assets/bobAssets/${dir}/${file}`;
  }, [category, iconName]);

  // 2) couleurs de la marque (le hook peut renvoyer une string OU un tableau)
  const brandColors = useColorBrand(brand);
  const [c1, c2] = useMemo<[string, string]>(() => {
    if (!brandColors) return ["#4E8CFF", "#4E8CFF"]; // fallback sobre
    if (Array.isArray(brandColors)) {
      const a = brandColors[0] ?? brandColors[1] ?? "#000000";
      const b = brandColors[1] ?? brandColors[0] ?? a;
      return [a, b];
    }
    return [brandColors, brandColors];
  }, [brandColors]);

  // 3) fetch du SVG
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(src);
        if (!r.ok) throw new Error("not ok");
        const txt = await r.text();
        if (alive) setSvgMarkup(txt);
      } catch {
        try {
          const fb = await fetch("/assets/bobAssets/general/default.svg");
          const txt = await fb.text();
          if (alive) setSvgMarkup(txt);
        } catch {
          if (alive) setSvgMarkup("");
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [src]);

  const style: CSSVars = { "--c1": c1, "--c2": c2 };

  return (
    <span
      className="bob-icon"
      style={style}
      aria-label={iconName}
      role="img"
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default BobIcon;

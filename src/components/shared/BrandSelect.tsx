// BrandSelect.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import "./BrandSelect.scss";

interface BrandSelectProps {
  brands?: string[];
  selectedBrand: string;
  onSelect: (brand: string) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// 🔎 Détecte la valeur "Tous" (et variantes)
const isAllValue = (v?: string) => {
  const n = normalize(v || "");
  return n === "tous" || n === "tout" || n === "all";
};

export const BrandSelect = ({
  brands = [],
  selectedBrand = "",
  onSelect,
  onClear,
  placeholder = "Choisir une marque",
  searchPlaceholder = "Rechercher une marque…",
  className = "",
}: BrandSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const safeBrands = Array.isArray(brands) ? brands : [];
  const brandLogos = useBrandLogos(safeBrands);

  /** Renvoie la forme "canonique" d'une marque (exacte dans `brands`), sinon `undefined` */
  const toCanonicalBrand = (name?: string) => {
    if (!name) return undefined;
    const n = normalize(name);
    return safeBrands.find((b) => normalize(b) === n);
  };

  const normalizedBrands = useMemo(() => {
    const list = safeBrands
      .map((b) => b?.trim())
      .filter((b): b is string => Boolean(b));
    const unique = Array.from(new Set(list));

    if (query.trim()) {
      const q = normalize(query);
      return unique.filter((b) => normalize(b).includes(q));
    }
    return unique;
  }, [safeBrands, query]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /**
   * Affiche soit le logo (si marque connue ET logo non fallback),
   * soit un badge texte/initiales.
   * ⚠️ Si "Tous" → pas d'image/badge (retourne null).
   */
  const renderBadge = (brand?: string) => {
    if (isAllValue(brand)) return null; // 🚫 rien à côté de "Tous"

    const canonical = toCanonicalBrand(brand);
    if (!canonical) {
      const label = (brand || "?").trim();
      return (
        <span className="brand-badge__initial">
          {label ? label.slice(0, 2).toUpperCase() : "?"}
        </span>
      );
    }

    const logo = brandLogos[canonical];
    if (logo && logo !== FALLBACK_BRAND_PLACEHOLDER) {
      return <img src={logo} alt="" />;
    }
    return (
      <span className="brand-badge__initial">
        {canonical.slice(0, 2).toUpperCase()}
      </span>
    );
  };

  const rootClassName = ["brand-select", className].filter(Boolean).join(" ");
  const triggerClassName = [
    "brand-select__trigger",
    selectedBrand ? "brand-select__trigger--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} ref={containerRef}>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => setOpen((prev) => !prev)}
      >
        {/* 🚫 Ne pas afficher d'image/badge pour "Tous" */}
        {!isAllValue(selectedBrand) && (
          <span className="brand-badge">{renderBadge(selectedBrand)}</span>
        )}
        <span className="brand-select__label">
          {selectedBrand || placeholder}
        </span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="brand-select__content">
          <div className="brand-select__search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
            />
            {query && (
              <button
                type="button"
                className="brand-select__search-clear"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <ul className="brand-select__list">
            {normalizedBrands.length === 0 && (
              <li className="brand-select__empty">Aucune marque trouvée</li>
            )}
            {normalizedBrands.map((brand) => {
              const optionClassName = [
                "brand-select__option",
                brand === selectedBrand ? "active" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const hideBadge = isAllValue(brand);

              return (
                <li key={brand}>
                  <button
                    type="button"
                    className={optionClassName}
                    onClick={() => {
                      onSelect(brand);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    {/* 🚫 Pas de logo/badge pour l’option "Tous" */}
                    {!hideBadge && (
                      <span className="brand-badge">{renderBadge(brand)}</span>
                    )}
                    <span className="brand-select__option-label">{brand}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selectedBrand && (
            <button
              type="button"
              className="brand-select__clear"
              onClick={() => {
                onClear?.();
                setQuery("");
                setOpen(false);
              }}
            >
              <X size={14} />
              Retirer la marque
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandSelect;

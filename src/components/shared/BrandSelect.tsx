// BrandSelect.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import "./BrandSelect.scss";

interface BrandSelectProps {
  brands?: string[]; // ← optionnel
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

export const BrandSelect = ({
  brands = [], // ← défaut
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

  const renderBadge = (brand?: string) => {
    const lookup = brand?.trim();
    if (!lookup) return <span className="brand-badge__initial">?</span>;
    const logo = brandLogos[lookup];
    if (logo && logo !== FALLBACK_BRAND_PLACEHOLDER) {
      return <img src={logo} alt="" />;
    }
    return (
      <span className="brand-badge__initial">
        {lookup?.slice(0, 2).toUpperCase()}
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
        <span className="brand-badge">{renderBadge(selectedBrand)}</span>
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
                    <span className="brand-badge">{renderBadge(brand)}</span>
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

import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import "./Champs.scss";
import Avatar from "../shared/Avatar";
import Trigger from "./Trigger/Trigger";
import { SearchBar } from "./SearchBar/SearchBar";
import SelectOption from "./SelectOption/SelectOption";
import Select from "@src/components/selectInput/Select";
import { truncate } from "@src/utils/stringUtils";
import type { LucideIcon } from "lucide-react";

export type SelectFilterOption<V extends string = string> = {
  value: V;
  label: string;
  emoji?: string;
  iconUrl?: string;
  iconFallback?: string;
  iconAlt?: string;
  siteUrl?: string;
  IconComponent?: LucideIcon;
};

type Props<V extends string = string> = {
  options: SelectFilterOption<V>[];
  value: V;
  onChange: (val: V) => void;
  activeOnValue?: V;
  activeClassName?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "grid";
  brandSelect?: boolean;
  iconVisible?: boolean;
  minWidth?: number;
  minWidthPart?: "1" | "2" | "both";
  align?: "left" | "center" | "right";
  placeholderResetLabel?: string;
  maxLength?: number;
  loading?: boolean;
};

const normalize = (label?: string) => label?.toLowerCase().trim() ?? "";
const PLACEHOLDER_LABEL = normalize("Choisir une marque");

export default function SelectFilter<V extends string = string>({
  options,
  value,
  onChange,
  activeOnValue,
  activeClassName,
  className = "",
  disabled = false,
  variant = "default",
  brandSelect,
  iconVisible = true,
  minWidth = 0,
  align = "center",
  minWidthPart = "both",
  placeholderResetLabel,
  loading = false,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [autoMinWidth, setAutoMinWidth] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionsContainerRef = useRef<HTMLDivElement | null>(null);
  const measurementRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? options[0],
    [options, value],
  );

  const isLoading = Boolean(loading);
  const hasSelectedValue = Boolean(value);

  const placeholderOption = useMemo(
    () => options.find((opt) => !opt.value),
    [options],
  );

  const isBrandSelect = useMemo(() => {
    if (typeof brandSelect === "boolean") return brandSelect;
    if (!placeholderOption) return false;
    const normalizedPlaceholder = normalize(placeholderOption.label);
    const hasEmptyValue =
      !placeholderOption.value || `${placeholderOption.value}`.length === 0;
    return hasEmptyValue && normalizedPlaceholder === PLACEHOLDER_LABEL;
  }, [brandSelect, placeholderOption]);

  const shouldHideForLoading =
    isLoading && !(isBrandSelect && hasSelectedValue);

  const optionsWithoutPlaceholder = useMemo(
    () =>
      options.filter((opt) => {
        const val = `${opt.value ?? ""}`;
        return val.length > 0;
      }),
    [options],
  );

  const resolvedResetLabel =
    placeholderResetLabel ?? (isBrandSelect ? "Réinitialiser" : undefined);

  const shouldHidePlaceholder = useMemo(() => {
    if (!placeholderOption) return true;
    if (isBrandSelect) {
      return true;
    }
    return Boolean(resolvedResetLabel);
  }, [isBrandSelect, placeholderOption, resolvedResetLabel]);

  const displayOptions = useMemo(
    () => (shouldHidePlaceholder ? optionsWithoutPlaceholder : options),
    [options, optionsWithoutPlaceholder, shouldHidePlaceholder],
  );

  const measurementCandidates = useMemo(() => {
    if (!isBrandSelect) return [];
    if (shouldHidePlaceholder) {
      if (optionsWithoutPlaceholder.length) {
        return optionsWithoutPlaceholder;
      }
      if (placeholderOption) {
        return [placeholderOption as SelectFilterOption<V>];
      }
      return options;
    }
    return options;
  }, [
    isBrandSelect,
    options,
    optionsWithoutPlaceholder,
    placeholderOption,
    shouldHidePlaceholder,
  ]);

  const getDisplayLabel = useCallback(
    (rawLabel?: string) => {
      const label = rawLabel ?? "";
      if (!isBrandSelect) return label;
      return truncate(label, 20);
    },
    [isBrandSelect],
  );

  const normalizedSearch = useMemo(() => normalize(searchValue), [searchValue]);

  const matchesSearch = useCallback(
    (opt: SelectFilterOption<V>, query: string) => {
      if (!query) return true;
      const normalizedLabel = normalize(opt.label);
      const normalizedValue = normalize(`${opt.value ?? ""}`);
      return normalizedLabel.includes(query) || normalizedValue.includes(query);
    },
    [],
  );

  const filteredOptions = useMemo(() => {
    if (!isBrandSelect || !normalizedSearch) return displayOptions;

    return displayOptions.filter((opt) => matchesSearch(opt, normalizedSearch));
  }, [displayOptions, isBrandSelect, matchesSearch, normalizedSearch]);

  const hasBrandResults = useMemo(() => {
    if (!isBrandSelect || !normalizedSearch) return true;

    return displayOptions.some((opt) => matchesSearch(opt, normalizedSearch));
  }, [displayOptions, isBrandSelect, matchesSearch, normalizedSearch]);

  const showResetButton = Boolean(
    placeholderOption && value && resolvedResetLabel,
  );

  const renderBrandAvatar = useCallback(
    (
      opt?: SelectFilterOption<V>,
      size = 32,
      extraClass = "",
      preferLogo = true,
      fallbackInitial?: string,
    ) => {
      if (!opt) return null;
      const className = ["brand-logo", extraClass].filter(Boolean).join(" ");
      const pseudo = opt.label || `${opt.value ?? ""}` || "Marque";
      return (
        <Avatar
          avatar={null}
          pseudo={pseudo}
          type="brand"
          siteUrl={opt.siteUrl}
          preferBrandLogo={preferLogo}
          wrapperClassName={className}
          sizeHW={size}
          fallbackInitial={fallbackInitial}
        />
      );
    },
    [],
  );

  const renderLeadingVisual = useCallback((opt?: SelectFilterOption<V>) => {
    if (!opt) return null;

    if (opt.IconComponent) {
      const Icon = opt.IconComponent;
      return (
        <span className="select-filter-icon select-filter-icon--lucide">
          <Icon size={18} />
        </span>
      );
    }

    if (opt.emoji) {
      return <span className="select-filter-emoji">{opt.emoji}</span>;
    }

    if (opt.iconUrl) {
      return (
        <span className="select-filter-icon select-filter-icon--image">
          <img
            src={opt.iconUrl}
            alt={opt.iconAlt ?? opt.label}
            loading="lazy"
          />
        </span>
      );
    }

    const fallback = (opt.iconFallback ?? opt.label ?? "")
      .trim()
      .slice(0, 2)
      .toUpperCase();

    if (fallback) {
      return (
        <span className="select-filter-icon select-filter-icon--fallback">
          {fallback}
        </span>
      );
    }

    return null;
  }, []);

  const selectedVisual = useMemo(() => {
    if (!iconVisible) return null;
    if (!isBrandSelect) return renderLeadingVisual(selected);
    const isPlaceholder = !selected?.value;
    return renderBrandAvatar(
      selected,
      32,
      isPlaceholder ? "brand-logo--placeholder" : "",
      !isPlaceholder,
      isPlaceholder ? "?" : undefined,
    );
  }, [
    iconVisible,
    isBrandSelect,
    renderBrandAvatar,
    renderLeadingVisual,
    selected,
  ]);

  useLayoutEffect(() => {
    if (
      shouldHideForLoading ||
      !isBrandSelect ||
      !measurementCandidates.length
    ) {
      setAutoMinWidth(null);
      return;
    }
    if (typeof window === "undefined") return;

    const measure = () => {
      if (!measurementRef.current) return;
      const items = Array.from(
        measurementRef.current.querySelectorAll<HTMLElement>(
          ".select-filter-measure-item",
        ),
      );
      if (!items.length) return;
      const maxWidth = items.reduce((max, el) => {
        const width = el.getBoundingClientRect().width;
        return width > max ? width : max;
      }, 0);
      if (!maxWidth) return;
      setAutoMinWidth((prev) => {
        const next = Math.ceil(maxWidth);
        return prev === next ? prev : next;
      });
    };

    measure();
    const handleResize = () => measure();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && measurementRef.current) {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(measurementRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [iconVisible, isBrandSelect, measurementCandidates, shouldHideForLoading]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  useEffect(() => {
    if (shouldHideForLoading && open) {
      setOpen(false);
    }
  }, [open, shouldHideForLoading]);

  useEffect(() => {
    if (!open && searchValue) {
      setSearchValue("");
    }
  }, [open, searchValue]);

  useEffect(() => {
    if (open && isBrandSelect) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [open, isBrandSelect]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      if (optionsContainerRef.current) {
        optionsContainerRef.current.scrollTop = 0;
      }
    });
  }, [open]);

  const interactionDisabled = disabled || shouldHideForLoading;

  // Gestion ouverture + mesure (évite cumul de marginTop)
  const toggleOpen = () => {
    if (interactionDisabled) return;
    setOpen((prev) => {
      const next = !prev;

      if (next) {
        requestAnimationFrame(() => {
          const h =
            wrapperRef.current?.getBoundingClientRect().height ??
            wrapperRef.current?.scrollHeight ??
            0;
          setOffset(h ? h + 5 : 50);
          setTimeout(() => setOffset(null), 200);
        });
      }
      return next;
    });
  };

  const pick = (v: V, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onChange(v);
    setOpen(false);
  };

  const resolvedActiveClass = activeClassName?.trim();
  const shouldApplyActiveClass =
    Boolean(resolvedActiveClass) &&
    (open || (activeOnValue !== undefined && value === activeOnValue));
  const baseClass =
    variant === "grid"
      ? "select-filter-wrapper--grid"
      : "select-filter-wrapper";
  const resetClass =
    variant === "grid"
      ? "popup-hot-filter-footer grid"
      : "popup-hot-filter-footer";
  const wrapperCls = [
    baseClass,
    shouldApplyActiveClass ? resolvedActiveClass : "",
    shouldHideForLoading ? "is-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const numericMinWidth = typeof minWidth === "number" ? minWidth : 0;
  const computedMinWidth = Math.max(
    numericMinWidth,
    isBrandSelect && typeof autoMinWidth === "number" ? autoMinWidth : 0,
  );
  const cssMinW = computedMinWidth
    ? `${computedMinWidth}px`
    : typeof minWidth === "string"
      ? minWidth
      : undefined;
  const cssAlign = typeof align === "string" ? align : "center";

  const shouldApplyWrapperMinWidth =
    minWidthPart === "both" ||
    minWidthPart === "1" ||
    (isBrandSelect && computedMinWidth > 0);
  const shouldApplyPopupMinWidth =
    minWidthPart === "both" || minWidthPart === "2";

  const wrapperStyle: React.CSSProperties = {
    ["--text-align" as any]: cssAlign,
    ...(shouldApplyWrapperMinWidth && cssMinW ? { minWidth: cssMinW } : {}),
    ...(shouldHideForLoading ? { display: "none" } : {}),
  };

  const popupStyle: React.CSSProperties = {
    marginTop: offset ? `${offset}px` : "60px",
    ...(shouldApplyPopupMinWidth && cssMinW ? { minWidth: cssMinW } : {}),
  };

  return (
    <div
      ref={wrapperRef}
      className={wrapperCls}
      onClick={interactionDisabled ? undefined : toggleOpen}
      aria-expanded={shouldHideForLoading ? false : open}
      aria-haspopup="listbox"
      style={wrapperStyle}
    >
      <div
        className={`popup-hot-filter ${open ? "is-open" : ""}`}
        style={popupStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="popup-hot-filter-container"
          role="listbox"
          ref={optionsContainerRef}
        >
          {isBrandSelect && (
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onClear={() => {
                setSearchValue("");
                searchInputRef.current?.focus();
              }}
              placeholder="Rechercher une marque"
              inputRef={searchInputRef}
            />
          )}

          {filteredOptions.map((opt) => {
            let optionVisual: React.ReactNode = null;
            if (iconVisible) {
              if (brandSelect === true) {
                optionVisual = renderBrandAvatar(
                  opt,
                  35,
                  !opt.value ? "brand-logo--placeholder" : "",
                  Boolean(opt.value),
                  !opt.value ? "?" : undefined,
                );
              } else if (brandSelect === false) {
                optionVisual = renderLeadingVisual(opt);
              } else {
                optionVisual =
                  opt.emoji || !isBrandSelect
                    ? renderLeadingVisual(opt)
                    : renderBrandAvatar(
                        opt,
                        35,
                        !opt.value ? "brand-logo--placeholder" : "",
                        Boolean(opt.value),
                        !opt.value ? "?" : undefined,
                      );
              }
            }

            const optionClasses = ["select-filter-option"];
            if (!opt.value) {
              optionClasses.push("select-filter-option--placeholder");
            }
            if (opt.value === value) optionClasses.push("is-selected");

            return (
              <SelectOption
                key={opt.value}
                value={opt.value}
                label={getDisplayLabel(opt.label)}
                leading={optionVisual}
                selected={opt.value === value}
                isPlaceholder={!opt.value}
                onSelect={pick}
              />
            );
          })}

          {isBrandSelect && normalizedSearch && !hasBrandResults && (
            <span className="select-filter-empty">Aucune marque trouvée</span>
          )}
        </div>
        {showResetButton && placeholderOption && (
          <div className={resetClass}>
            <button
              type="button"
              className="select-filter-reset"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pick(placeholderOption.value as V, e);
              }}
            >
              {resolvedResetLabel}
            </button>
          </div>
        )}
      </div>

      <Select
        options={options}
        value={value}
        onChange={onChange}
        disabled={interactionDisabled}
        className={"select-filter"}
      />
      <Trigger
        leading={selectedVisual}
        label={getDisplayLabel(selected?.label)}
      />
      {isBrandSelect && measurementCandidates.length > 0 && (
        <div
          className="select-filter-measurements"
          aria-hidden
          ref={measurementRef}
        >
          {measurementCandidates.map((opt, idx) => (
            <Trigger
              key={`measure-${opt.value ?? idx}-${opt.label}-${idx}`}
              leading={
                iconVisible ? (
                  <span className="select-filter-leading-placeholder" />
                ) : undefined
              }
              label={getDisplayLabel(opt.label)}
              className="select-filter-measure-item"
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useRef, useState, type RefObject } from "react";
import "./AdminBrandsHeader.scss";
import closeButtonFilter from "/assets/dashboardUser/closeButtonFilter.svg";
import useOutsideClick from "@src/hooks/useOutsideClick";
import {
  ADMIN_BRANDS_FILTER_CONFIG,
  type AdminBrandsFiltersState,
} from "@src/types/Filters";

type FilterChangeHandler = <K extends keyof AdminBrandsFiltersState>(
  key: K,
  value: AdminBrandsFiltersState[K],
) => void;

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onAddBrand: () => void;
  brandsLength: number;
  filters: AdminBrandsFiltersState;
  onFilterChange: FilterChangeHandler;
  onClearFilters: () => void;
}

const toggleMultiValue = <T extends string>(current: T[], value: T) =>
  current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];

const AdminBrandsHeader = ({
  search,
  onSearchChange,
  onAddBrand,
  brandsLength,
  filters,
  onFilterChange,
  onClearFilters,
}: Props) => {
  const [visibleFilter, setVisibleFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(
    dropdownRef as RefObject<HTMLElement>,
    () => setVisibleFilter(false),
    visibleFilter,
  );

  const planConfig = ADMIN_BRANDS_FILTER_CONFIG.find(
    (config) => config.key === "plans",
  );
  const sectorConfig = ADMIN_BRANDS_FILTER_CONFIG.find(
    (config) => config.key === "sectors",
  );
  const lastActionConfig = ADMIN_BRANDS_FILTER_CONFIG.find(
    (config) => config.key === "lastAction",
  );

  const planLabelByValue = Object.fromEntries(
    planConfig?.options.map((option) => [option.value, option.label]) ?? [],
  );
  const sectorLabelByValue = Object.fromEntries(
    sectorConfig?.options.map((option) => [option.value, option.label]) ?? [],
  );
  const lastActionLabelByValue = Object.fromEntries(
    lastActionConfig?.options.map((option) => [option.value, option.label]) ??
      [],
  );

  const activeFilterCount =
    filters.plans.length +
    filters.sectors.length +
    (filters.lastAction ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const handleRemovePlan = (plan: string) =>
    onFilterChange(
      "plans",
      filters.plans.filter((item) => item !== plan),
    );

  const handleRemoveSector = (sector: string) =>
    onFilterChange(
      "sectors",
      filters.sectors.filter((item) => item !== sector),
    );

  const handleRemoveLastAction = () =>
    onFilterChange("lastAction", "" as AdminBrandsFiltersState["lastAction"]);

  return (
    <div className="admin-brands-header">
      <div className="admin-brands-header-stats-container">
        <div className="admin-brands-header-title">
          <h1>Marques partenaires</h1>
        </div>
        <div className="admin-brands-header-stats">
          <h2>{brandsLength}</h2>
          <span>+{Math.floor(Math.random() * 100)}</span>
        </div>
      </div>

      <div className="admin-brands-actions">
        <div className="admin-brands-action-filter">
          <button
            onClick={() => setVisibleFilter(!visibleFilter)}
            className="admin-brands-action-filter-button"
          >
            Filtrer{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
          {visibleFilter && (
            <div
              className="admin-brands-action-filter-button-dropdown"
              ref={dropdownRef}
            >
              {planConfig && (
                <div className="admin-brands-action-filter-section">
                  <span className="admin-brands-action-filter-section-title">
                    {planConfig.label}
                  </span>
                  <div className="admin-brands-action-filter-options">
                    {planConfig.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`admin-brands-action-filter-option ${
                          filters.plans.includes(
                            option.value as AdminBrandsFiltersState["plans"][number],
                          )
                            ? "is-selected"
                            : ""
                        }`}
                        onClick={() =>
                          onFilterChange(
                            "plans",
                            toggleMultiValue(
                              filters.plans,
                              option.value as AdminBrandsFiltersState["plans"][number],
                            ),
                          )
                        }
                        aria-pressed={filters.plans.includes(
                          option.value as AdminBrandsFiltersState["plans"][number],
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sectorConfig && (
                <div className="admin-brands-action-filter-section">
                  <span className="admin-brands-action-filter-section-title">
                    {sectorConfig.label}
                  </span>
                  <div className="admin-brands-action-filter-options">
                    {sectorConfig.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`admin-brands-action-filter-option ${
                          filters.sectors.includes(option.value)
                            ? "is-selected"
                            : ""
                        }`}
                        onClick={() =>
                          onFilterChange(
                            "sectors",
                            toggleMultiValue(filters.sectors, option.value),
                          )
                        }
                        aria-pressed={filters.sectors.includes(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {lastActionConfig && (
                <div className="admin-brands-action-filter-section">
                  <span className="admin-brands-action-filter-section-title">
                    {lastActionConfig.label}
                  </span>
                  <div className="admin-brands-action-filter-options">
                    {lastActionConfig.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`admin-brands-action-filter-option ${
                          filters.lastAction === option.value
                            ? "is-selected"
                            : ""
                        }`}
                        onClick={() =>
                          onFilterChange(
                            "lastAction",
                            filters.lastAction === option.value
                              ? ("" as AdminBrandsFiltersState["lastAction"])
                              : (option.value as AdminBrandsFiltersState["lastAction"]),
                          )
                        }
                        aria-pressed={filters.lastAction === option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="admin-brands-action-filter-footer">
                <button
                  type="button"
                  className="admin-brands-action-filter-clear"
                  onClick={() => onClearFilters()}
                  disabled={activeFilterCount === 0}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="admin-brands-actions-search-bar">
          <input
            type="text"
            placeholder="Rechercher une marque…"
            className="admin-brands-actions-search-bar-input"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="admin-brands-actions-add-brand">
          <button
            className="admin-brands-actions-add-brand-button"
            onClick={onAddBrand}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="admin-brands-filters-summary">
          {filters.plans.map((plan) => (
            <button
              key={`plan-${plan}`}
              type="button"
              className="admin-brands-filter-chip"
              onClick={() => handleRemovePlan(plan)}
            >
              {planLabelByValue[plan] ?? plan}
              <span className="admin-brands-filter-chip-close">
                <img src={closeButtonFilter} alt="" />
              </span>
            </button>
          ))}
          {filters.sectors.map((sector) => (
            <button
              key={`sector-${sector}`}
              type="button"
              className="admin-brands-filter-chip"
              onClick={() => handleRemoveSector(sector)}
            >
              {sectorLabelByValue[sector] ?? sector}
              <span className="admin-brands-filter-chip-close">
                <img src={closeButtonFilter} alt="" />
              </span>
            </button>
          ))}
          {filters.lastAction && (
            <button
              type="button"
              className="admin-brands-filter-chip"
              onClick={handleRemoveLastAction}
            >
              {lastActionLabelByValue[filters.lastAction] ?? filters.lastAction}
              <span className="admin-brands-filter-chip-close">
                <img src={closeButtonFilter} alt="" />
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBrandsHeader;

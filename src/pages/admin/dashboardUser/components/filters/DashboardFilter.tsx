import "./DashboardFilter.scss";

import { type CSSProperties, useRef, useState, type RefObject } from "react";

import closeButton from "/assets/dashboardUser/closeButtonFilter.svg";
import useOutsideClick from "@src/hooks/useOutsideClick";
import {
  DASHBOARD_USER_BRAND_COUNT_LABELS,
  DASHBOARD_USER_CONTRIBUTOR_COLORS,
  DASHBOARD_USER_MORE_FILTERS,
  DASHBOARD_USER_PRIMARY_FILTERS,
  DASHBOARD_USER_STATUS_COLORS,
  DASHBOARD_USER_UP_RANGE_LABELS,
  // type AgeRange,
  type BrandCountRange,
  type DashboardUserFiltersState,
  // type GenderLabel,
  type UpRange,
} from "@src/types/Filters";
import { type ContributorLabel, type StatutLabel } from "@src/types/Filters";

type DropdownType = "statut" | "contributor" | "upRange";

type FilterChangeHandler = <K extends keyof DashboardUserFiltersState>(
  key: K,
  value: DashboardUserFiltersState[K],
) => void;

type Props = {
  value: string;
  filters: DashboardUserFiltersState;
  onSearchChange: (v: string) => void;
  onFilterChange: FilterChangeHandler;
};

const toggleMultiValue = <T extends string>(current: T[], value: T) =>
  current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];

const DashboardFilter = ({
  value,
  filters,
  onSearchChange,
  onFilterChange,
}: Props) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const [allFilters, setAllFilters] = useState<boolean>(false);

  useOutsideClick(
    dropdownContainerRef as RefObject<HTMLElement>,
    () => {
      setOpenDropdown(null);
      setAllFilters(false);
    },
    Boolean(openDropdown || allFilters),
  );

  const toggleDropdown = (dropdown: DropdownType) => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const { statut, contributor, upRange, gender, ageRange, brandCount } =
    filters;

  const shouldShowUpRangeFilter = upRange !== "";
  const upRangeLabel = shouldShowUpRangeFilter
    ? DASHBOARD_USER_UP_RANGE_LABELS[upRange as Exclude<UpRange, "">]
    : undefined;
  const upRangeButtonLabel = upRangeLabel ?? "UP";

  const shouldShowAgeRangeFilter = ageRange !== "";
  const shouldShowBrandCountFilter = brandCount !== "";

  const handleToggleFilters = () => {
    setAllFilters((current) => !current);
  };

  const toggleStatutSelection = (value: StatutLabel) => {
    onFilterChange("statut", toggleMultiValue(statut, value));
  };

  const toggleContributorSelection = (value: ContributorLabel) => {
    onFilterChange("contributor", toggleMultiValue(contributor, value));
  };

  const handleUpRangeOptionSelect = (value: UpRange) => {
    const nextValue = upRange === value ? "" : value;
    onFilterChange("upRange", nextValue);
    closeDropdown();
  };

  // const toggleGenderSelection = (value: GenderLabel) => {
  //   onFilterChange("gender", toggleMultiValue(gender, value));
  // };

  // const handleAgeRangeOptionSelect = (value: AgeRange) => {
  //   onFilterChange("ageRange", ageRange === value ? "" : value);
  // };

  // const handleBrandCountOptionSelect = (value: BrandCountRange) => {
  //   onFilterChange("brandCount", brandCount === value ? "" : value);
  // };

  const statutButtonContent =
    statut.length === 0 ? (
      "Statut"
    ) : (
      <>
        <span
          className="dashboard-filter-dot"
          style={{
            backgroundColor: DASHBOARD_USER_STATUS_COLORS[statut[0]],
          }}
        />
        {statut[0]}
        {statut.length > 1 && ` +${statut.length - 1}`}
      </>
    );

  const contributorButtonContent =
    contributor.length === 0 ? (
      "Contributeurs"
    ) : (
      <>
        <span
          className="dashboard-filter-dot"
          style={{
            backgroundColor: DASHBOARD_USER_CONTRIBUTOR_COLORS[contributor[0]],
          }}
        />
        {contributor[0]}
        {contributor.length > 1 && ` +${contributor.length - 1}`}
      </>
    );

  const hasMoreFiltersSelected =
    gender.length > 0 || ageRange !== "" || brandCount !== "";

  const handleResetMoreFilters = () => {
    onFilterChange("gender", []);
    onFilterChange("ageRange", "");
    onFilterChange("brandCount", "");
  };

  const chips = [
    ...statut.map((item) => ({
      key: `statut-${item}`,
      label: item,
      onRemove: () =>
        onFilterChange(
          "statut",
          statut.filter((value) => value !== item),
        ),
    })),
    ...contributor.map((item) => ({
      key: `contributor-${item}`,
      label: item,
      onRemove: () =>
        onFilterChange(
          "contributor",
          contributor.filter((value) => value !== item),
        ),
    })),
    ...(shouldShowUpRangeFilter && upRangeLabel
      ? [
          {
            key: `up-${upRange}`,
            label: upRangeLabel,
            onRemove: () => onFilterChange("upRange", ""),
          },
        ]
      : []),
    ...gender.map((item) => ({
      key: `gender-${item}`,
      label: item,
      onRemove: () =>
        onFilterChange(
          "gender",
          gender.filter((value) => value !== item),
        ),
    })),
    ...(shouldShowAgeRangeFilter
      ? [
          {
            key: `age-${ageRange}`,
            label: ageRange,
            onRemove: () => onFilterChange("ageRange", ""),
          },
        ]
      : []),
    ...(shouldShowBrandCountFilter
      ? [
          {
            key: `brand-${brandCount}`,
            label:
              DASHBOARD_USER_BRAND_COUNT_LABELS[
                brandCount as Exclude<BrandCountRange, "">
              ],
            onRemove: () => onFilterChange("brandCount", ""),
          },
        ]
      : []),
  ];

  const statutOptions = DASHBOARD_USER_PRIMARY_FILTERS.find(
    (filter) => filter.key === "statut",
  )?.options as { label: string; value: StatutLabel }[];
  const contributorOptions = DASHBOARD_USER_PRIMARY_FILTERS.find(
    (filter) => filter.key === "contributor",
  )?.options as { label: string; value: ContributorLabel }[];
  const upRangeOptions = DASHBOARD_USER_PRIMARY_FILTERS.find(
    (filter) => filter.key === "upRange",
  )?.options as { label: string; value: UpRange }[];

  return (
    <div className="dashboard-filter-container">
      <div className="dashboard-filter-values">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="dashboard-filter-values-selected"
            onClick={chip.onRemove}
          >
            {chip.label}
            <img src={closeButton} alt="Close filter button" />
          </span>
        ))}
      </div>
      <div className="dashboard-filter-actions" ref={dropdownContainerRef}>
        <div className="dashboard-filter-actions-anchor">
          <div className="dashboard-filter-container-right">
            <div className="dashboard-filter-dropdown">
              <button
                type="button"
                className="select-statut-icon dashboard-filter-select"
                onClick={() => toggleDropdown("statut")}
              >
                {statutButtonContent}
              </button>
              {openDropdown === "statut" && (
                <div className="dashboard-filter-dropdown-panel">
                  {statutOptions?.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      className={`dashboard-filter-dropdown-option ${
                        statut.includes(status.value) ? "is-selected" : ""
                      }`}
                      onClick={() => toggleStatutSelection(status.value)}
                    >
                      <span
                        className="dashboard-filter-dot"
                        style={{
                          backgroundColor:
                            DASHBOARD_USER_STATUS_COLORS[status.value],
                        }}
                      />
                      {status.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-filter-dropdown">
              <button
                type="button"
                className="select-contributor-icon dashboard-filter-select"
                onClick={() => toggleDropdown("contributor")}
              >
                {contributorButtonContent}
              </button>
              {openDropdown === "contributor" && (
                <div className="dashboard-filter-dropdown-panel">
                  {contributorOptions?.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`dashboard-filter-dropdown-option ${
                        contributor.includes(item.value) ? "is-selected" : ""
                      }`}
                      style={
                        {
                          "--contributor-hover":
                            DASHBOARD_USER_CONTRIBUTOR_COLORS[item.value],
                        } as CSSProperties
                      }
                      onClick={() => toggleContributorSelection(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-filter-dropdown">
              <button
                type="button"
                className="select-up-icon dashboard-filter-select"
                onClick={() => toggleDropdown("upRange")}
              >
                {upRangeButtonLabel}
              </button>
              {openDropdown === "upRange" && (
                <div className="dashboard-filter-dropdown-panel">
                  {upRangeOptions?.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      className={`dashboard-filter-dropdown-option ${
                        upRange === range.value ? "is-selected" : ""
                      }`}
                      onClick={() => handleUpRangeOptionSelect(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                className="select--icon dashboard-filter-select"
                onClick={handleToggleFilters}
              >
                Plus de Filtre
              </button>
              {allFilters && (
                <div className="dashboard-filter-more-panel">
                  {DASHBOARD_USER_MORE_FILTERS.map((filter) => {
                    const current = filters[filter.key];
                    const isMulti = filter.type === "multi";
                    return (
                      <div
                        key={filter.key}
                        className="dashboard-filter-more-section"
                      >
                        <span className="dashboard-filter-more-title">
                          {filter.label}
                        </span>
                        <div className="dashboard-filter-more-options">
                          {filter.options.map((option) => {
                            const isSelected = isMulti
                              ? (current as string[]).includes(option.value)
                              : current === option.value;
                            const nextValue = isMulti
                              ? toggleMultiValue(
                                  current as string[],
                                  option.value,
                                )
                              : current === option.value
                                ? ""
                                : option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={`dashboard-filter-more-option ${
                                  isSelected ? "is-selected" : ""
                                }`}
                                onClick={() =>
                                  onFilterChange(
                                    filter.key,
                                    nextValue as DashboardUserFiltersState[typeof filter.key],
                                  )
                                }
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="dashboard-filter-more-footer">
                    <button
                      type="button"
                      className="dashboard-filter-more-reset"
                      onClick={handleResetMoreFilters}
                      disabled={!hasMoreFiltersSelected}
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <input
                type="text"
                name="search"
                id="search"
                value={value}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher"
                aria-label="Rechercher"
                className="search-input-icon dashboard-filter-search"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilter;

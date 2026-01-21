import "./DashboardFilter.scss";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import closeButton from "/assets/dashboardUser/closeButtonFilter.svg";

type StatutLabel = "actif" | "suspendu" | "supprimé";
type ContributorLabel =
  | "Porteur d'idées"
  | "Explorateur de bugs"
  | "Ambassadeur"
  | "Polycontributeur";
type UpRange = "inf-10" | "10-30" | "30-50" | "sup-50" | "";
type UpRangeKey = Exclude<UpRange, "">;
type DropdownType = "statut" | "contributor" | "upRange";

type Props = {
  value: string;
  selectedStatuts: StatutLabel[];
  selectedContributors: ContributorLabel[];
  selectedUpRange: UpRange;
  onChange: (v: string) => void;
  onStatutChange: (statuts: StatutLabel[]) => void;
  onContributorChange: (contributors: ContributorLabel[]) => void;
  onUpRangeChange: (range: UpRange) => void;
};

const ALL_STATUSES: StatutLabel[] = ["actif", "suspendu", "supprimé"];
const ALL_CONTRIBUTOR_TYPES: ContributorLabel[] = [
  "Porteur d'idées",
  "Explorateur de bugs",
  "Ambassadeur",
  "Polycontributeur",
];
const UP_RANGE_LABELS: Record<UpRangeKey, string> = {
  "inf-10": "Inférieur à 10",
  "10-30": "Entre 10 et 30",
  "30-50": "Entre 30 et 50",
  "sup-50": "Superieur à 50",
};
const CONTRIBUTOR_COLORS: Record<ContributorLabel, string> = {
  "Porteur d'idées": "#C253F120",
  "Explorateur de bugs": "#4C6BF620",
  Ambassadeur: "#FF282C20",
  Polycontributeur: "#32D27520",
};
const STATUS_COLORS: Record<StatutLabel, string> = {
  actif: "#22c55e",
  suspendu: "#facc15",
  supprimé: "#ef4444",
};

const DashboardFilter = ({
  value,
  selectedStatuts,
  selectedContributors,
  selectedUpRange,
  onChange,
  onStatutChange,
  onContributorChange,
  onUpRangeChange,
}: Props) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownType | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openDropdown &&
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (dropdown: DropdownType) => {
    setOpenDropdown((current) => (current === dropdown ? null : dropdown));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const shouldShowUpRangeFilter = selectedUpRange !== "";
  const upRangeLabel = shouldShowUpRangeFilter
    ? UP_RANGE_LABELS[selectedUpRange as UpRangeKey]
    : undefined;
  const upRangeButtonLabel = upRangeLabel ?? "UP";

  const [allFilters, setAllFilters] = useState<boolean>(false);

  const handleToggleFilters = () => {
    setAllFilters((current) => !current);
  };

  const toggleStatutSelection = (statut: StatutLabel) => {
    const next = selectedStatuts.includes(statut)
      ? selectedStatuts.filter((item) => item !== statut)
      : [...selectedStatuts, statut];
    onStatutChange(next);
  };

  const handleDeleteStatutFilter = (statut: StatutLabel) =>
    onStatutChange(selectedStatuts.filter((item) => item !== statut));

  const toggleContributorSelection = (contributor: ContributorLabel) => {
    const next = selectedContributors.includes(contributor)
      ? selectedContributors.filter((item) => item !== contributor)
      : [...selectedContributors, contributor];
    onContributorChange(next);
  };

  const handleDeleteContributorFilter = (contributor: ContributorLabel) =>
    onContributorChange(
      selectedContributors.filter((item) => item !== contributor),
    );

  const handleUpRangeOptionSelect = (value: UpRange) => {
    const nextValue = selectedUpRange === value ? "" : value;
    onUpRangeChange(nextValue);
    closeDropdown();
  };

  const handleDeleteUpRangeFilter = () => onUpRangeChange("");

  const statutButtonContent =
    selectedStatuts.length === 0 ? (
      "Statut"
    ) : (
      <>
        <span
          className="dashboard-filter-dot"
          style={{
            backgroundColor: STATUS_COLORS[selectedStatuts[0]],
          }}
        />
        {selectedStatuts[0]}
        {selectedStatuts.length > 1 && ` +${selectedStatuts.length - 1}`}
      </>
    );

  const contributorButtonContent =
    selectedContributors.length === 0 ? (
      "Contributeurs"
    ) : (
      <>
        <span
          className="dashboard-filter-dot"
          style={{
            backgroundColor:
              CONTRIBUTOR_COLORS[selectedContributors[0]] ?? "#000",
          }}
        />
        {selectedContributors[0]}
        {selectedContributors.length > 1 &&
          ` +${selectedContributors.length - 1}`}
      </>
    );

  return (
    <div className="dashboard-filter-container">
      <div className="dashboard-filter-values">
        {allFilters && (
          <div>
            <h1>TEST</h1>
          </div>
        )}
        {selectedStatuts.map((statut) => (
          <span
            key={`statut-${statut}`}
            className="dashboard-filter-values-selected"
            onClick={() => handleDeleteStatutFilter(statut)}
          >
            {statut}
            <img src={closeButton} alt="Close filter button" />
          </span>
        ))}
        {selectedContributors.map((contributor) => (
          <span
            key={`contributor-${contributor}`}
            className="dashboard-filter-values-selected"
            onClick={() => handleDeleteContributorFilter(contributor)}
          >
            {contributor}
            <img src={closeButton} alt="Close filter button" />
          </span>
        ))}
        {shouldShowUpRangeFilter && upRangeLabel && (
          <span
            className="dashboard-filter-values-selected"
            onClick={() => handleDeleteUpRangeFilter()}
          >
            {upRangeLabel}
            <img src={closeButton} alt="Close filter button" />
          </span>
        )}
      </div>
      <div
        className="dashboard-filter-container-right"
        ref={dropdownContainerRef}
      >
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
              {ALL_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`dashboard-filter-dropdown-option ${
                    selectedStatuts.includes(status) ? "is-selected" : ""
                  }`}
                  onClick={() => toggleStatutSelection(status)}
                >
                  <span
                    className="dashboard-filter-dot"
                    style={{
                      backgroundColor: STATUS_COLORS[status],
                    }}
                  />
                  {status}
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
              {ALL_CONTRIBUTOR_TYPES.map((contributor) => (
                <button
                  key={contributor}
                  type="button"
                  className={`dashboard-filter-dropdown-option ${
                    selectedContributors.includes(contributor)
                      ? "is-selected"
                      : ""
                  }`}
                  style={
                    {
                      "--contributor-hover": CONTRIBUTOR_COLORS[contributor],
                    } as CSSProperties
                  }
                  onClick={() => toggleContributorSelection(contributor)}
                >
                  {contributor}
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
              {(Object.keys(UP_RANGE_LABELS) as UpRangeKey[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`dashboard-filter-dropdown-option ${
                    selectedUpRange === range ? "is-selected" : ""
                  }`}
                  onClick={() => handleUpRangeOptionSelect(range)}
                >
                  {UP_RANGE_LABELS[range]}
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
        </div>
        <div>
          <input
            type="text"
            name="search"
            id="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher"
            aria-label="Rechercher"
            className="search-input-icon dashboard-filter-search"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFilter;

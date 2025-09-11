/* import "./HomeFilters.scss";
import hotImg from "/assets/filters-reports/hot.png";
import rageImg from "/assets/filters-reports/rage.png";
import popularImg from "/assets/filters-reports/popular.png";
import urgentImg from "/assets/filters-reports/carrying.png";
import recentImg from "/assets/filters-reports/recent.png";

const allFilters = [
  {
    key: "chrono",
    label: "Les plus récents",
    emoji: "📅",
    illustration: recentImg,
  },
  {
    key: "confirmed",
    label: "Ça chauffe par ici",
    emoji: "🔥",
    illustration: hotImg,
  },
  {
    key: "rage",
    label: "Les plus rageants",
    emoji: "😡",
    illustration: rageImg,
  },
  {
    key: "popular",
    label: "Les plus populaires",
    emoji: "👍",
    illustration: popularImg,
  },
  {
    key: "urgent",
    label: "À shaker vite",
    emoji: "👀",
    illustration: urgentImg,
  },
];

type HomeFiltersProps = {
  selectedFilter: string;
  onChange: (key: string) => void;
  availableFilters?: string[];
};

const HomeFilters = ({ selectedFilter, onChange, availableFilters }: HomeFiltersProps) => {
  const filtersToShow = availableFilters
    ? allFilters.filter((f) => availableFilters.includes(f.key))
    : allFilters;

  const selectedKey = selectedFilter === "" ? "chrono" : selectedFilter;
  const selected = filtersToShow.find((f) => f.key === selectedKey);

  const isActive = (key: string) =>
    (key === "chrono" && selectedFilter === "") || key === selectedFilter;

  return (
    <div className="home-filters">
      <div className="content-background" />
      <div className="filters-header">
        {selected && <img src={selected.illustration} alt={selected.label} />}
      </div>

      <div className="filters-list">
        {filtersToShow.map((f) => (
          <button
            key={f.key}
            className={`filter-line ${isActive(f.key) ? "active" : ""}`}
            onClick={() => onChange(f.key)}
          >
            <span className="emoji">{f.emoji}</span>
            <span className="label">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeFilters;
 */
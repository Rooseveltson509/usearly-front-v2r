import "./HomeFilters.scss";
import hotImg from "/assets/filters-reports/hot.png";
import rageImg from "/assets/filters-reports/rage.png";
import popularImg from "/assets/filters-reports/popular.png";
import urgentImg from "/assets/filters-reports/carrying.png";

const allFilters = [
  { key: "hot", label: "Ça chauffe par ici", emoji: "🔥", illustration: hotImg },
  { key: "rage", label: "Les plus rageants", emoji: "😡", illustration: rageImg },
  { key: "popular", label: "Les plus populaires", emoji: "👍", illustration: popularImg },
  { key: "urgent", label: "À shaker vite", emoji: "👀", illustration: urgentImg },
];

type HomeFiltersProps = {
  selectedFilter: string;
  onChange: (key: string) => void;
  availableFilters?: string[]; // ⬅️ les filtres à afficher
};

const HomeFilters = ({ selectedFilter, onChange, availableFilters }: HomeFiltersProps) => {
  const filtersToShow = availableFilters
    ? allFilters.filter((f) => availableFilters.includes(f.key))
    : allFilters;

  const selected = filtersToShow.find((f) => f.key === selectedFilter);

  return (
    <div className="home-filters">
      <div className="filters-header">
        <h2>Les signalements récents !</h2>
        {selected && <img src={selected.illustration} alt={selected.label} />}
      </div>

      <div className="filters-list">
        {filtersToShow.map((f) => (
          <button
            key={f.key}
            className={`filter-line ${selectedFilter === f.key ? "active" : ""}`}
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

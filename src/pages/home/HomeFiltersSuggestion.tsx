import "./HomeFiltersSuggestion.scss";


const HomeFiltersSuggestion: React.FC = () => {
  return (
    <div className="suggestion-filters">
      <div className="home-filters-cdc">
        <div className="filter-item">
          <img
            src="/assets/filters-reports/heart-popular.png"
            alt="popularité"
            className="filter-icon"
          />
          <span className="filter-label">Les plus populaires</span>
        </div>
        <div className="filter-item">
          <img
            src="/assets/filters-reports/suggestion-open.png"
            alt="enflammé"
            className="filter-icon"
          />
          <span className="filter-label">Votes ouverts</span>
        </div>
        <div className="filter-item">
          <img
            src="/assets/filters-reports/suggestion-adopt.png"
            alt="aimées"
            className="filter-icon"
          />
          <span className="filter-label">Suggestions adoptées</span>
        </div>
        <div className="filter-item">
          <img
            src="/assets/filters-reports/suggestion-top.png"
            alt="aimées"
            className="filter-icon"
          />
          <span className="filter-label">Le top de la semaine</span>
        </div>
      </div>
    </div>
  );
};

export default HomeFiltersSuggestion;

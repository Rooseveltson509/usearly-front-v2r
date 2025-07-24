import "./HomeFiltersCdc.scss";

const HomeFiltersCdc: React.FC = () => {
  return (
    <div className="cdc-filters">
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
            src="/assets/filters-reports/heart-fire.png"
            alt="enflammé"
            className="filter-icon"
          />
          <span className="filter-label">Les plus enflammés</span>
        </div>
        <div className="filter-item">
          <img
            src="/assets/filters-reports/heart-arrow.png"
            alt="aimées"
            className="filter-icon"
          />
          <span className="filter-label">Les marques les plus aimées</span>
        </div>
      </div>{" "}
    </div>
  );
};

export default HomeFiltersCdc;

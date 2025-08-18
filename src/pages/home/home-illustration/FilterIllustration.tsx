import "./FilterIllustration.scss";
import hotImg from "/assets/filters-reports/hot.png";
import rageImg from "/assets/filters-reports/rage.png";
import popularImg from "/assets/filters-reports/popular.png";
import urgentImg from "/assets/filters-reports/carrying.png";
import recentImg from "/assets/filters-reports/recent.png";

const illustrationMap = {
  chrono: {
    label: "Les plus récents",
    emoji: "📅",
    img: recentImg,
  },
  confirmed: {
    label: "Ça chauffe par ici",
    emoji: "🔥",
    img: hotImg,
  },
  rage: {
    label: "Les plus rageants",
    emoji: "😡",
    img: rageImg,
  },
  popular: {
    label: "Les plus populaires",
    emoji: "👍",
    img: popularImg,
  },
  urgent: {
    label: "À shaker vite",
    emoji: "👀",
    img: urgentImg,
  },
};

type Props = {
  filter: string;
};

const FilterIllustration = ({ filter }: Props) => {
  const data = illustrationMap[filter === "" ? "chrono" : filter as keyof typeof illustrationMap];

  if (!data) return null;

  return (
    <div className="filter-illustration-sidebar">
      {/* <div className="content-background" /> */}
      <div className="illustration-content">
        <img src={data.img} alt={data.label} />
        <p>{data.label}</p>
      </div>
    </div>
  );
};

export default FilterIllustration;

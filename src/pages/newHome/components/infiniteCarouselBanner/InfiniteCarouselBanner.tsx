import "./InfiniteCarouselBanner.scss";
import reportIcon from "/assets/icons/reportYellowIcon.svg";
import heartIcon from "/assets/icons/cdc-icon.svg";
import sparklesIcon from "/assets/icons/suggest-icon.svg";

const ITEMS = [
  { icon: reportIcon, label: "Signalements" },
  { icon: heartIcon, label: "coup de coeur" },
  { icon: sparklesIcon, label: "Suggestions" },
];

const InfiniteCarouselBanner = () => {
  return (
    <div
      className="infinite-carousel-banner"
      aria-label="Signalements, coup de coeur, Suggestions"
    >
      <div className="marquee" role="presentation">
        <div className="marquee__track">
          <div className="marquee__group">
            {ITEMS.map((item) => (
              <div className="marquee__item" key={item.label}>
                <img
                  className="marquee__icon"
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                />
                <span className="marquee__label">{item.label}</span>
              </div>
            ))}
          </div>
          <div
            className="marquee__group marquee__group--clone"
            aria-hidden="true"
          >
            {ITEMS.map((item) => (
              <div className="marquee__item" key={`clone-${item.label}`}>
                <img
                  className="marquee__icon"
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                />
                <span className="marquee__label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCarouselBanner;

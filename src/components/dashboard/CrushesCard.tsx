import { ChevronLeft, ChevronRight } from "lucide-react";
import "./SuggestionCrush.scss";

const crushes = [
  { title: "Livraison rapide", upvotes: 428, percentage: 60, trend: "up" },
  { title: "Interface intuitive", upvotes: 234, percentage: 50, trend: "up" },
  {
    title: "Service client réactif",
    upvotes: 127,
    percentage: 40,
    trend: "up",
  },
  {
    title: "Service client test",
    upvotes: 127,
    percentage: 40,
    trend: "up",
  },
];

const crushProfiles = [
  {
    name: "Jess",
    brand: "Lovable",
    avatar: "/assets/images/p5.png",
    tagline: "Gros crush pour l'app",
  },
  {
    name: "Julie",
    brand: "Lovable",
    avatar: "/assets/images/p8.png",
    tagline: "Vibes de love pour....",
  },
];

const CrushesCard = () => {
  return (
    <div className="crush-card">
      <div className="crush-card-container">
        <div className="crush-header">
          <h3 className="crush-title">Les gros crushs du moment !</h3>
          <span className="heart-sticker" aria-hidden="true">
            ❤️
          </span>
        </div>

        <div className="crush-carousel">
          <button className="arrow-btn" type="button" aria-label="Précédent">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="crush-faces">
            {crushProfiles.map((profile) => (
              <div key={profile.name} className="crush-face">
                <div className="tag-bubble">{profile.tagline}</div>
                <div className="crush-avatar-wrap">
                  <div className="crush-avatar-ring">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="crush-avatar"
                    />
                    <div className="crush-gradient-heart" aria-hidden="true">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="crush-avatar"
                      />
                    </div>
                  </div>
                </div>
                <p className="crush-name">
                  {profile.name}{" "}
                  <span className="crush-brand"> x {profile.brand}</span>
                </p>
              </div>
            ))}
          </div>
          <button className="arrow-btn" type="button" aria-label="Suivant">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="crush-list">
          {crushes.map((crush, index) => (
            <div key={crush.title} className="crush-item">
              <div className="crush-left">
                <span className="crush-rank">{index + 1}.</span>
                <span>{crush.title}</span>
              </div>
              <div className="crush-right">
                <span className="crush-right-stat">❤️ {crush.upvotes}</span>
                <span className="crush-right-stat">👏 {crush.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="pill-cta crush-cta">Mettre en avant</button>
    </div>
  );
};

export default CrushesCard;

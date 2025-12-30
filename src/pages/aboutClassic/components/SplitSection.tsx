import { useRef, type ReactNode, type RefObject } from "react";
import MouseTrail from "../../newHome/components/heroSection/MouseTrail";
import usePlanetScene from "../hooks/usePlanetScene";

type SplitSectionProps = {
  sectionRef: RefObject<HTMLDivElement | null>;
};

type CardContent = {
  id: string;
  className?: string;
  content: ReactNode;
};

const CARDS: CardContent[] = [
  {
    id: "frustration",
    content: (
      <>
        <span className="about-classic__card-description">
          Usearly est né d’une frustration largement partagée{" "}
        </span>
        <span className="about-classic__card-description--highlight">
          Signaler un problème ou un irritant reste souvent un parcours du
          combattant. Entre les formulaires interminables et l’incertitude
          d’être entendu, l’utilisateur se retrouve seul, sans comprendre ce qui
          se passe et sans solution.
        </span>
      </>
    ),
  },
  {
    id: "mission",
    className: "about-classic__card--offset",
    content: (
      <>
        <span className="about-classic__card-description">
          Notre mission est simple : permettre à chaque utilisateur d’être
          véritablement entendu{" "}
        </span>{" "}
        Avec Usearly, nous voulons renverser cette tendance pour que vous
        puissiez signaler un problème ou proposer une idée en toute simplicité.
        Grâce à la communauté vous obtenez des réponses et des solutions en
        temps réel et influencez directement l’évolution des sites et
        applications que vous utilisez au quotidien.
      </>
    ),
  },
];

const ABOUT_TRAIL_IMAGES = Array.from(
  { length: 13 },
  (_, index) => `/assets/images/about/imageAbout${index + 1}.png`,
);

const SplitSection = ({ sectionRef }: SplitSectionProps) => (
  <div
    className="about-classic__section about-classic__section--split"
    ref={sectionRef}
  >
    <Cards />
    <div className="about-classic__statement">
      <PlanetCanvas />
    </div>
  </div>
);

const Cards = () => (
  <div className="about-classic__cards">
    {CARDS.map((card) => (
      <article
        className={`about-classic__card${card.className ? ` ${card.className}` : ""}`}
        key={card.id}
      >
        <p className="Raleway">{card.content}</p>
      </article>
    ))}
  </div>
);

const PlanetCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  usePlanetScene(canvasRef as RefObject<HTMLCanvasElement>);

  return (
    <div className="about-classic__canvas-wrap">
      <canvas id="c" ref={canvasRef} aria-label="Planète 3D"></canvas>
      <MouseTrail images={ABOUT_TRAIL_IMAGES} mode="random" />
    </div>
  );
};

export default SplitSection;

import { useRef, useEffect, useState, type JSX } from "react";
import "./FavoriteSection.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SlideType = "cdc" | "suggestion" | "report";

const TITLES: Record<SlideType, JSX.Element> = {
  cdc: (
    <>
      Les coups de ❤️ <br />
      que vous avez le <br />
      plus aimés !
    </>
  ),
  suggestion: (
    <>
      Les suggestions <br />
      qui vous font rêver ✨
    </>
  ),
  report: (
    <>
      Les signalements <br />
      qui ont le plus fait râler <br />
      cette semaine 😅
    </>
  ),
};

const BG_COLORS: Record<SlideType, string> = {
  cdc: "#D6CCFF",
  suggestion: "#DBF4C7",
  report: "#D7E9FF",
};

export default function FavoriteSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLImageElement[]>([]);
  const [activeType, setActiveType] = useState<SlideType>("cdc");
  const [ready, setReady] = useState(false);

  const imageList = [
    { src: "/assets/slides/cardCDC1.png", type: "cdc" as SlideType },
    { src: "/assets/slides/cardCDC2.png", type: "cdc" as SlideType },
    {
      src: "/assets/slides/cardSuggestion1.png",
      type: "suggestion" as SlideType,
    },
    {
      src: "/assets/slides/cardSuggestion2.png",
      type: "suggestion" as SlideType,
    },
    { src: "/assets/slides/cardSignal1.png", type: "report" as SlideType },
    { src: "/assets/slides/cardSignal2.png", type: "report" as SlideType },
  ];

  const cardTypes = imageList.map((i) => i.type);

  // ---------------------------------------------------
  // ⚡ Improved Image Preloading – zero flash + faster
  // ---------------------------------------------------
  useEffect(() => {
    let loaded = 0;

    imageList.forEach((img) => {
      const im = new Image();
      im.decoding = "async";
      im.loading = "eager"; // chargement prioritaire
      im.src = img.src;

      im.onload = () => {
        loaded++;
        if (loaded === imageList.length) {
          setReady(true);
        }
      };
    });
  }, []);

  // ---------------------------------------------------
  // 🌟 Ultra-Optimized GSAP animation
  // ---------------------------------------------------
  useEffect(() => {
    if (!ready) return;
    if (window.innerWidth < 900) return;
    if (!sectionRef.current) return;

    const contentEl = sectionRef.current.querySelector(
      ".favorite-content",
    ) as HTMLDivElement;

    // GPU acceleration
    cardsRef.current.forEach((card) => {
      (card as HTMLImageElement).style.willChange = "transform";
    });

    contentEl.style.willChange = "background-color";

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=450%",
        scrub: 0.5, // interpolation lissée
        pin: true,
        anticipatePin: 1, // évite les micro-sauts

        onUpdate: (self) => {
          const progress = self.progress;
          const segment = 1 / (imageList.length - 1);
          const index = Math.min(
            imageList.length - 1,
            Math.floor(progress / segment),
          );
          const newType = cardTypes[index];
          setActiveType((old) => (old !== newType ? newType : old));
        },
      },
    });

    const START_BELOW = window.innerHeight;

    // Position initiale
    cardsRef.current.forEach((card, i) => {
      gsap.set(card, {
        y: i === 0 ? 0 : START_BELOW,
        opacity: 1,
        zIndex: i + 1,
      });
    });

    // Animation de montée
    cardsRef.current.forEach((card, i) => {
      if (i > 0) {
        tl.to(card, { y: 0, duration: 1, ease: "none" });
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready]);

  return (
    <section className="favorite-section" ref={sectionRef}>
      <div
        className="favorite-content"
        style={{
          backgroundColor: BG_COLORS[activeType],
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div className="fav-left">
          <h2 className="fav-title">{TITLES[activeType]}</h2>
          <button className="fav-btn">Découvrir</button>
        </div>

        <div className="fav-right">
          {imageList.map((item, i) => (
            <img
              key={i}
              src={item.src}
              loading="lazy"
              className="fav-card"
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* import { useRef, useEffect, useState, type JSX } from "react";
import "./FavoriteSection.scss";

// GSAP ultra-light
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// OPTION : registre seulement ce dont tu as besoin
gsap.registerPlugin(ScrollTrigger);

type SlideType = "cdc" | "suggestion" | "report";

const TITLES: Record<SlideType, JSX.Element> = {
  cdc: (
    <>
      Les coups de ❤️ <br />
      que vous avez le <br />
      plus aimés !
    </>
  ),
  suggestion: (
    <>
      Les suggestions <br />
      qui vous font rêver ✨
    </>
  ),
  report: (
    <>
      Les signalements <br />
      qui ont le plus fait râler <br />
      cette semaine 😅
    </>
  ),
};

const BG_COLORS: Record<SlideType, string> = {
  cdc: "#D6CCFF",
  suggestion: "#DBF4C7",
  report: "#D7E9FF",
};

export default function FavoriteSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLImageElement[]>([]);
  const [activeType, setActiveType] = useState<SlideType>("cdc");
  const [ready, setReady] = useState(false);

  const imageList = [
    { src: "/assets/slides/cardCDC1.png", type: "cdc" as SlideType },
    { src: "/assets/slides/cardCDC2.png", type: "cdc" as SlideType },
    { src: "/assets/slides/cardSuggestion1.png", type: "suggestion" as SlideType },
    { src: "/assets/slides/cardSuggestion2.png", type: "suggestion" as SlideType },
    { src: "/assets/slides/cardSignal1.png", type: "report" as SlideType },
    { src: "/assets/slides/cardSignal2.png", type: "report" as SlideType },
  ];

  const cardTypes = imageList.map((i) => i.type);

  // ⚡ PRÉ-CHARGEMENT DES IMAGES → plus de flash
  useEffect(() => {
    let loaded = 0;
    imageList.forEach((img) => {
      const im = new Image();
      im.src = img.src;
      im.onload = () => {
        loaded++;
        if (loaded === imageList.length) {
          setReady(true);
        }
      };
    });
  }, []);

  // 🌟 ANIMATION GSAP ultra-optimisée
  useEffect(() => {
    if (!ready) return; // attendre les images

    if (window.innerWidth < 900) return; // désactiver sur mobile

    if (!sectionRef.current) return;

    const contentEl = sectionRef.current.querySelector(".favorite-content")!;

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=450%",
        scrub: true,
        pin: true,

        // 🔥 Mise à jour dynamique et fiable du type actif
        onUpdate: (self) => {
          const progress = self.progress;
          const segment = 1 / (imageList.length - 1);
          const index = Math.min(
            imageList.length - 1,
            Math.floor(progress / segment)
          );
          const newType = cardTypes[index];
          setActiveType((old) => (old !== newType ? newType : old));
        },
      },
    });

    const START_BELOW = window.innerHeight;

    // Position initiale
    cardsRef.current.forEach((card, i) => {
      gsap.set(card, {
        y: i === 0 ? 0 : START_BELOW,
        opacity: 1,
        zIndex: i + 1,
      });
    });

    // Animation montée
    cardsRef.current.forEach((card, i) => {
      if (i > 0) {
        tl.to(card, { y: 0, duration: 1, ease: "none" });
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready]);

  return (
    <section className="favorite-section" ref={sectionRef}>
      <div
        className="favorite-content"
        style={{
          backgroundColor: BG_COLORS[activeType],
          opacity: ready ? 1 : 0, // fade-in smooth
          transition: "opacity 0.4s ease",
        }}
      >
        <div className="fav-left">
          <h2 className="fav-title">{TITLES[activeType]}</h2>
          <button className="fav-btn">Découvrir</button>
        </div>

        <div className="fav-right">
          {imageList.map((item, i) => (
            <img
              key={i}
              src={item.src}
              loading="lazy"
              className="fav-card"
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
 */

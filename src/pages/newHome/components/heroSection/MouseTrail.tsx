import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import "./MouseTrail.scss";

interface MouseTrailProps {
  images: string[];
}

const MouseTrail: React.FC<MouseTrailProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const last = useRef({ x: 0, y: 0 });
  const lerpPos = useRef({ x: 0, y: 0 });

  const threshold = 55; // distance mini avant apparition d’une nouvelle image
  const lerpFactor = 0.15; // fluidité EXACTE du site original
  const cooldown = 55; // empêche d’avoir trop d’images
  const lastSpawn = useRef(0);
  const imageIndex = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    container.addEventListener("mousemove", handleMove);

    const loop = () => {
      // mouvement fluide
      lerpPos.current.x += (mouseX - lerpPos.current.x) * lerpFactor;
      lerpPos.current.y += (mouseY - lerpPos.current.y) * lerpFactor;

      // distance depuis la dernière image
      const dx = lerpPos.current.x - last.current.x;
      const dy = lerpPos.current.y - last.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > threshold) {
        spawnImage(lerpPos.current.x, lerpPos.current.y);
        last.current = { ...lerpPos.current };
      }

      rafId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      container.removeEventListener("mousemove", handleMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const spawnImage = (x: number, y: number) => {
    const now = performance.now();
    if (now - lastSpawn.current < cooldown) return;
    lastSpawn.current = now;

    const container = containerRef.current;
    if (!container) return;

    const img = document.createElement("img");
    img.src = images[imageIndex.current];
    img.className = "trail-img";

    imageIndex.current = (imageIndex.current + 1) % images.length;

    // ⭐ Position brute (sans translate)
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    container.appendChild(img);

    // ⭐ Rotation légère et stable
    const tilt = (x - last.current.x) * 0.25;

    anime({
      targets: img,

      opacity: [
        { value: 1, duration: 200, easing: "easeOutQuad" },
        { value: 1, duration: 250 },
        { value: 0, duration: 700, easing: "easeInQuad" },
      ],

      scale: [
        { value: 0.3, duration: 0 },
        { value: 1, duration: 300, easing: "easeOutCubic" },
        { value: 0.95, duration: 200, easing: "linear" },
        { value: 0, duration: 700, easing: "easeInQuad" },
      ],

      rotate: tilt, // rotation uniquement

      duration: 1400,
      easing: "easeOutSine",
      complete: () => img.remove(),
    });
  };

  return <div ref={containerRef} className="mouse-trail-container"></div>;
};

export default MouseTrail;

import { useEffect, useRef, useState } from "react";

interface Img {
  id: number;
  src: string;
}

export function useMouseRevealImage(images: Img[]) {
  const [active, setActive] = useState<{
    img: Img;
    x: number;
    y: number;
  } | null>(null);

  const indexRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const stopTimeout = useRef<number | null>(null);

  useEffect(() => {
    const MIN_MOVE = 50;
    const VISIBLE_MS = 250;

    function onMove(e: MouseEvent) {
      const dx = Math.abs(e.clientX - lastPos.current.x);
      const dy = Math.abs(e.clientY - lastPos.current.y);
      const moved = Math.sqrt(dx * dx + dy * dy);

      if (moved < MIN_MOVE) return;

      lastPos.current = { x: e.clientX, y: e.clientY };

      const img = images[indexRef.current];
      indexRef.current = (indexRef.current + 1) % images.length;

      setActive({
        img,
        x: e.clientX,
        y: e.clientY,
      });

      if (stopTimeout.current) clearTimeout(stopTimeout.current);
      stopTimeout.current = window.setTimeout(() => {
        setActive(null);
      }, VISIBLE_MS);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [images]);

  return active;
}

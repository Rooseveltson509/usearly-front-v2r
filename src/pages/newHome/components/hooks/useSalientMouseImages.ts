import { useEffect, useRef, useState } from "react";

export interface FollowImage {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export const useSalientMouseImages = (images: string[]) => {
  const [activeImages, setActiveImages] = useState<FollowImage[]>([]);
  const imageIndex = useRef(0);
  const lastSpawnTime = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dx = mouseX - lastPos.current.x;
      //const dy = mouseY - lastPos.current.y;
      const rotation = dx * 0.1;

      lastPos.current = { x: mouseX, y: mouseY };

      const now = Date.now();

      // ⛔ limiter : une image toutes les 120ms
      if (now - lastSpawnTime.current < 120) {
        // On ne met à jour QUE l'image qui suit la souris
        setActiveImages((prev) => {
          if (prev.length === 0) return prev;

          const updated = [...prev];
          updated[updated.length - 1].x = mouseX;
          updated[updated.length - 1].y = mouseY;
          updated[updated.length - 1].rotation = rotation;

          return updated;
        });
        return;
      }

      lastSpawnTime.current = now;

      const nextImage: FollowImage = {
        id: now,
        src: images[imageIndex.current],
        x: mouseX,
        y: mouseY,
        rotation,
        opacity: 1,
      };

      imageIndex.current = (imageIndex.current + 1) % images.length;

      setActiveImages((prev) => {
        const list = [...prev, nextImage];

        // ❗ on ne garde QUE 2 images max (cursor + ghost)
        if (list.length > 2) list.shift();

        return list;
      });

      // Ghost fade out
      setTimeout(() => {
        setActiveImages((prev) =>
          prev.map((img) =>
            img.id === nextImage.id ? { ...img, opacity: 0 } : img,
          ),
        );
      }, 120);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return activeImages;
};

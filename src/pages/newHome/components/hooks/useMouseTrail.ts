import { useEffect, useRef, useState } from "react";

export interface TrailImage {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
}

export const useMouseTrail = (images: string[]) => {
  const [trail, setTrail] = useState<TrailImage[]>([]);
  const imageIndex = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // vitesse → rotation
      const dx = mouseX - lastPos.current.x;
      //const dy = mouseY - lastPos.current.y;
      //const speed = Math.sqrt(dx * dx + dy * dy);
      const rotation = (dx / 40) * 10; // rotation smooth

      lastPos.current = { x: mouseX, y: mouseY };

      // Ajouter une nouvelle image dans la file (train)
      const newImage: TrailImage = {
        id: Date.now(),
        src: images[imageIndex.current],
        x: mouseX,
        y: mouseY,
        rotation,
      };

      imageIndex.current = (imageIndex.current + 1) % images.length; // boucle sur images

      setTrail((prev) => [...prev, newImage]);

      // supprimer après délai
      setTimeout(() => {
        setTrail((prev) => prev.filter((i) => i.id !== newImage.id));
      }, 350); // stack 350ms comme Salient
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return trail;
};

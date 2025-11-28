import React, { useEffect, useRef, useState } from "react";
import "./MouseRevealImages.scss";

interface MouseRevealImagesProps {
  images: string[];
}

const MouseRevealImages: React.FC<MouseRevealImagesProps> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState<
    { id: number; src: string; x: number; y: number }[]
  >([]);

  const imgIndexRef = useRef(0);
  const lastMoveTime = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();

      // ↓ délai plus humain
      if (now - lastMoveTime.current < 150) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // ↓ distance minimale
      const dx = Math.abs(x - lastPos.current.x);
      const dy = Math.abs(y - lastPos.current.y);

      if (dx < 40 && dy < 40) return;

      lastPos.current = { x, y };
      lastMoveTime.current = now;

      const id = Date.now();
      const src = images[imgIndexRef.current];

      imgIndexRef.current = (imgIndexRef.current + 1) % images.length;

      setVisible((prev) => [...prev, { id, src, x, y }]);

      // disparition après animation complète
      setTimeout(() => {
        setVisible((prev) => prev.filter((i) => i.id !== id));
      }, 900);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [images]);

  return (
    <div ref={containerRef} className="mouse-reveal-container">
      {visible.map((img) => (
        <img
          key={img.id}
          src={img.src}
          className="mouse-img"
          style={{
            left: img.x,
            top: img.y,
          }}
        />
      ))}
    </div>
  );
};

export default MouseRevealImages;

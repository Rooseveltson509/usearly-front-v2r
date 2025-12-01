import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./ScrollInlineImages.scss";

interface RevealImage {
  line: number;
  wordIndex: number;
  src: string;
  rotate?: boolean;
}

interface Props {
  lines: string[];
  images: RevealImage[];
}

export default function ScrollInlineImages({ lines, images }: Props) {
  return (
    <div className="scroll-inline-wrapper">
      {lines.map((line, index) => {
        const imgConfig = images.find((i) => i.line === index);
        return <InlineLine key={index} line={line} image={imgConfig} />;
      })}
    </div>
  );
}

function InlineLine({ line, image }: { line: string; image?: RevealImage }) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Détection inView pour animation texte + glossy
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  const words = line.split(" ");
  const before = image ? words.slice(0, image.wordIndex) : words;
  const after = image ? words.slice(image.wordIndex) : [];

  // ✨ GLOSSY EFFECT
  useEffect(() => {
    if (!ref.current) return;
    if (inView) {
      ref.current.classList.add("sheen-active");
      setTimeout(() => ref.current?.classList.remove("sheen-active"), 650);
    }
  }, [inView]);

  // ⭐ ROTATION AUTOMATIQUE SI rotate === true
  const [currentSrc, setCurrentSrc] = useState(image?.src);

  useEffect(() => {
    if (!image?.rotate) return;

    const logos = [
      "/assets/images/airbnd.png",
      "/assets/images/bourso.png",
      "/assets/images/duo.png",
      "/assets/images/lbo.png",
      "/assets/images/nike.png",
    ];

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % logos.length;
      setCurrentSrc(logos[index]);
    }, 1500);

    return () => clearInterval(interval);
  }, [image?.rotate]);

  return (
    <motion.div
      ref={ref}
      className={`inline-line ${inView ? "active" : ""}`}
      animate={inView ? "visible" : "hidden"}
      initial="hidden"
      variants={{
        hidden: { opacity: 0.25, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
    >
      {before.join(" ")}

      {image && (
        <motion.span
          className="img-slot"
          animate={inView ? "visible" : "hidden"}
          initial="hidden"
          variants={{
            hidden: {
              width: 0,
              opacity: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            visible: {
              width: "auto",
              opacity: 1,
              marginLeft: "0.25rem",
              marginRight: "0.25rem",
              transition: { duration: 0.35 },
            },
          }}
        >
          <motion.img
            src={image.rotate ? currentSrc : image.src}
            className="inline-photo"
            animate={inView ? "visible" : "hidden"}
            initial="hidden"
            variants={{
              hidden: { opacity: 0, y: 6, scale: 0.85 },
              visible: {
                opacity: 1,
                y: -4,
                scale: 1,
                transition: { duration: 0.35, ease: "easeOut" },
              },
            }}
          />
        </motion.span>
      )}

      {" " + after.join(" ")}
    </motion.div>
  );
}

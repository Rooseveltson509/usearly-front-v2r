import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import "./ScrollInlineImages.scss";

interface RevealImage {
  line: number;
  wordIndex: number;
  src: string;
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
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });

  const controls = useAnimation();
  const imgControls = useAnimation();

  const words = line.split(" ");
  const before = image ? words.slice(0, image.wordIndex) : words;
  const after = image ? words.slice(image.wordIndex) : [];

  useEffect(() => {
    controls.start(inView ? "visible" : "hidden");
    imgControls.start(inView ? "visible" : "hidden");
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="inline-line"
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0.25, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
      }}
    >
      {before.join(" ")}

      {/* 🔥 SLOT QUI GRANDIT AU MOMENT DU SCROLL */}
      {image && (
        <motion.span
          className="img-slot"
          animate={imgControls}
          initial="hidden"
          variants={{
            hidden: { width: 0, opacity: 0, marginLeft: 0, marginRight: 0 },
            visible: {
              width: "auto",
              opacity: 1,
              marginLeft: "0.3rem",
              marginRight: "0.3rem",
              transition: { duration: 0.45 },
            },
          }}
        >
          <motion.img
            src={image.src}
            className="inline-photo"
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={imgControls}
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.85 },
              visible: {
                opacity: 1,
                y: -6,
                scale: 1,
                transition: { duration: 0.4 },
              },
            }}
          />
        </motion.span>
      )}

      {" " + after.join(" ")}
    </motion.div>
  );
}

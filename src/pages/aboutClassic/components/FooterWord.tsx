import UsearlyDrawing from "@src/components/background/Usearly";
import useRevealOnce from "../hooks/useRevealOnce";

const FooterWord = () => {
  const { isVisible, ref } = useRevealOnce(0.35);

  return (
    <div
      className={`about-classic__footer-word${isVisible ? " is-visible" : ""}`}
      ref={ref}
    >
      <UsearlyDrawing
        animationDuration="25"
        strokeWidth={2}
        color="#ffffff3d"
      />
    </div>
  );
};

export default FooterWord;

import { useEffect, useRef, useState } from "react";
import "./ExtensionExampleText.scss";
import TextPill from "@src/components/text-pill/textPill";
import type { ExtensionScenario } from "../extensionExample.types";

const exprimationIndexByOption: Record<ExtensionScenario, number> = {
  signalez: 0,
  suggérez: 1,
  félicitez: 2,
};

type ExtensionExampleTextProps = {
  selected: ExtensionScenario;
  setSelected: (scenario: ExtensionScenario) => void;
};

const ExtensionExampleText = ({
  selected,
  setSelected,
}: ExtensionExampleTextProps) => {
  const [valueExprimation, setValueExprimation] = useState<number>(
    exprimationIndexByOption[selected],
  );

  const exprimationOptions = [
    "rencontrez un bug !",
    "avez une suggestion d’idée !",
    "vibrer pour une fonctionnalité !",
  ];

  const targetText = exprimationOptions[valueExprimation];
  const [displayedText, setDisplayedText] = useState(targetText);
  const [phase, setPhase] = useState<"idle" | "deleting" | "typing">("idle");
  const typingSpeed = 35;
  const deletingSpeed = 22;
  const pauseBeforeTyping = 120;
  const firstRender = useRef(true);

  useEffect(() => {
    setValueExprimation(exprimationIndexByOption[selected]);
  }, [selected]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPhase("deleting"); // déclenche l'effacement avant de retaper
  }, [targetText]);

  useEffect(() => {
    if (phase === "idle") return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (phase === "deleting") {
      if (displayedText.length === 0) {
        timeout = setTimeout(() => setPhase("typing"), pauseBeforeTyping);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    }

    if (phase === "typing") {
      if (displayedText === targetText) {
        setPhase("idle");
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(targetText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      }
    }

    return () => timeout && clearTimeout(timeout);
  }, [
    phase,
    displayedText,
    targetText,
    deletingSpeed,
    typingSpeed,
    pauseBeforeTyping,
  ]);

  // 🎨 Couleurs actives / inactives
  const ACTIVE = { color: "#ffffff", bg: "#4549EF" };
  const INACTIVE = { color: "#4549EF", bg: "#4549EF" }; // même teinte mais fond léger

  return (
    <div className="extension-example-text-container">
      <h2 className="extension-example-title">
        Exprimez-vous au <br /> moment même où <br />
        vous <span className="text-highlight-usearly">{displayedText}</span>
      </h2>

      <p className="extension-example-description">
        Exprimez-vous en temps réel :{" "}
        <TextPill
          title="signalez"
          isActive={selected === "signalez"}
          color={selected === "signalez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "signalez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => {
            setValueExprimation(exprimationIndexByOption["signalez"]);
            setSelected("signalez");
          }}
        />{" "}
        un problème,{" "}
        <TextPill
          title="félicitez"
          isActive={selected === "félicitez"}
          color={selected === "félicitez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "félicitez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => {
            setValueExprimation(exprimationIndexByOption["félicitez"]);
            setSelected("félicitez");
          }}
        />{" "}
        pour une fonctionnalité qui vous facilite la vie, ou{" "}
        <TextPill
          title="suggérez"
          isActive={selected === "suggérez"}
          color={selected === "suggérez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "suggérez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => {
            setValueExprimation(exprimationIndexByOption["suggérez"]);
            setSelected("suggérez");
          }}
        />{" "}
        une idée d'amélioration.
      </p>
    </div>
  );
};

export default ExtensionExampleText;

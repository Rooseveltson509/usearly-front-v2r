import React, { useState } from "react";
import "./ExtensionExampleText.scss";
import TextPill from "@src/components/text-pill/textPill";

const ExtensionExampleText = () => {
  type Option = "signalez" | "suggérez" | "félicitez";

  const [selected, setSelected] = useState<Option>("signalez");

  // 🎨 Couleurs actives / inactives
  const ACTIVE = { color: "#ffffff", bg: "#4549EF" };
  const INACTIVE = { color: "#4549EF", bg: "#4549EF29" }; // même teinte mais fond léger

  return (
    <div className="extension-example-text-container">
      <h2 className="extension-example-title">
        Exprimez-vous au moment même où vous{" "}
        <span className="text-highlight-usearly">rencontrez un bug !</span>
      </h2>
      <p className="extension-example-description">
        Exprimez-vous en temps réel :{" "}
        <TextPill
          title="signalez"
          isActive={selected === "signalez"}
          color={selected === "signalez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "signalez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => setSelected("signalez")}
        />{" "}
        un problème,{" "}
        <TextPill
          title="félicitez"
          isActive={selected === "félicitez"}
          color={selected === "félicitez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "félicitez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => setSelected("félicitez")}
        />{" "}
        pour une fonctionnalité qui vous plaît, ou{" "}
        <TextPill
          title="suggérez"
          isActive={selected === "suggérez"}
          color={selected === "suggérez" ? ACTIVE.color : INACTIVE.color}
          backgroundColor={selected === "suggérez" ? ACTIVE.bg : INACTIVE.bg}
          onClick={() => setSelected("suggérez")}
        />{" "}
        une idée d'amélioration. En quelques clics, faites entendre votre voix
        auprès des marques et rejoignez une communauté de milliers
        d’utilisateurs, comme vous, qui souhaitent voir des évolutions concrètes
        et impactantes.
      </p>
    </div>
  );
};

export default ExtensionExampleText;

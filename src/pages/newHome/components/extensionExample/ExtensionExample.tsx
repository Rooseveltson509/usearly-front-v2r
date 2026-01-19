import { useState } from "react";
import "./extensionExample.scss";
import ExtensionExampleText from "./extensionExampleText/ExtensionExampleText";
import ExtensionExampleImage from "./extensionExampleImage/ExtensionExampleImage";
import type { ExtensionScenario } from "./extensionExample.types";
import bigUofUsearly from "/assets/icons/bigUofUsearly.svg";

const ExtensionExample = () => {
  const [selectedScenario, setSelectedScenario] =
    useState<ExtensionScenario>("signalez");

  return (
    <div className="extension-example-container">
      <ExtensionExampleText
        selected={selectedScenario}
        setSelected={setSelectedScenario}
      />
      <ExtensionExampleImage
        selected={selectedScenario}
        onSelect={setSelectedScenario}
        advanceMode="click"
      />
      <img className="img2" src={bigUofUsearly} alt="U of Usearly" />
    </div>
  );
};

export default ExtensionExample;

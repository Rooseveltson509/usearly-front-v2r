import "./ExtensionExampleImage.scss";
import type { ExtensionScenario } from "../extensionExample.types";
import { EXTENSION_SCENARIO_CONFIG } from "@src/config/extensionExample.config";

type Props = {
  selected: ExtensionScenario;
};

const ExtensionExampleImage = ({ selected }: Props) => {
  const config = EXTENSION_SCENARIO_CONFIG[selected];

  return (
    <div className="extension-example-image">
      {/* Background web */}
      <div className={`imgWebExample ${config.bgClass}`}>
        <img
          src={config.background}
          alt=""
          className="web-image"
          draggable={false}
        />
      </div>

      {/* Popup + bar */}
      <div className="extensionImg">
        <img
          src={config.popup}
          alt=""
          className={`extension-image ${config.modeClass}`}
          draggable={false}
        />
        <img
          src={config.bar}
          alt=""
          className={`extension-image-bar ${config.modeClass}`}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ExtensionExampleImage;

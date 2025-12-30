import { useEffect, useState, useCallback } from "react";
import "./ExtensionExampleImage.scss";
import type { ExtensionScenario } from "../extensionExample.types";
import { EXTENSION_SCENARIO_CONFIG } from "@src/config/extensionExample.config";
import logo from "/assets/logo.svg";
import points from "/assets/icons/3-points.svg";
import cdcIconWhite from "/assets/icons/cdc-icon-white.svg";
import cdcIcon from "/assets/icons/cdc-icon.svg";
import signalIconWhite from "/assets/icons/signal-icon-white.svg";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import suggestIconWhite from "/assets/icons/suggest-icon-white.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";

type Props = {
  /** Scénario sélectionné (contrôlé) */
  selected: ExtensionScenario;
  /** Callback si tu veux piloter depuis le parent. Si non fourni, le composant gère l'état local. */
  onSelect?: (s: ExtensionScenario) => void;
};

const ExtensionExampleImage = ({ selected, onSelect }: Props) => {
  // Fallback non-contrôlé si onSelect n'est pas fourni
  const [internalSelected, setInternalSelected] =
    useState<ExtensionScenario>(selected);
  useEffect(() => setInternalSelected(selected), [selected]);

  const current = onSelect ? selected : internalSelected;
  const config = EXTENSION_SCENARIO_CONFIG[current];

  const handleSelect = useCallback(
    (key: ExtensionScenario) => {
      if (onSelect) onSelect(key);
      else setInternalSelected(key);
    },
    [onSelect],
  );

  // Définition des 3 icônes cliquables (on conserve tes classes)
  const actions: Array<{
    key: ExtensionScenario;
    wrapperClass: string;
    alt: string;
    srcInactive: string;
    srcActive: string;
    testId: string;
  }> = [
    {
      key: "signalez",
      wrapperClass: "extension-report-icon",
      alt: "Signaler",
      srcInactive: signalIconWhite,
      srcActive: reportYellowIcon,
      testId: "icon-signalez",
    },
    {
      key: "félicitez",
      wrapperClass: "extension-cdc-icon",
      alt: "Coup de cœur",
      srcInactive: cdcIconWhite,
      srcActive: cdcIcon,
      testId: "icon-felicitez",
    },
    {
      key: "suggérez",
      wrapperClass: "extension-suggest-icon",
      alt: "Suggestion",
      srcInactive: suggestIconWhite,
      srcActive: suggestIcon,
      testId: "icon-suggerez",
    },
  ];

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
        <div className={`${config.modeClass}`}>
          <img
            src={config.popup}
            alt=""
            className={`extension-image ${config.modeClass}`}
            draggable={false}
          />
        </div>

        <div className="extension-icons">
          <div className="extension-logo-icon">
            <img src={logo} alt="" />
          </div>

          {/* Grip */}
          <div className="drag-area" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="6"
              viewBox="0 0 14 6"
              fill="none"
            >
              {[1, 5, 9, 13].flatMap((cx) => [
                <circle
                  key={`${cx}-top`}
                  cx={cx}
                  cy={1}
                  r={1}
                  fill="#D9D9D9"
                />,
                <circle
                  key={`${cx}-bottom`}
                  cx={cx}
                  cy={5}
                  r={1}
                  fill="#D9D9D9"
                />,
              ])}
            </svg>
          </div>

          {/* Icônes cliquables (on garde tes classes et on ajoute is-active) */}
          {actions.map(
            ({ key, wrapperClass, alt, srcInactive, srcActive, testId }) => {
              const active = current === key;
              return (
                <div
                  key={key}
                  className={`${wrapperClass} ${active ? "is-active" : ""}`}
                  role="button"
                  aria-pressed={active}
                  aria-label={alt}
                  tabIndex={0}
                  data-testid={testId}
                  onClick={() => handleSelect(key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(key);
                    }
                  }}
                >
                  <img src={active ? srcActive : srcInactive} alt={alt} />
                </div>
              );
            },
          )}
          <div className="extension-options-icon">
            <img src={points} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionExampleImage;

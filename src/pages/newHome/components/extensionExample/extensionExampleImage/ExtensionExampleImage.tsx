import { useEffect, useState, useCallback } from "react";
import "./ExtensionExampleImage.scss";
import type { ExtensionScenario } from "../extensionExample.types";
import { EXTENSION_SCENARIO_CONFIG } from "@src/config/extensionExample.config";
import ExtensionExamplePopup, {
  type CursorPath,
  type PopupAdvanceMode,
  type PopupAnimationPreset,
  type PopupClickTarget,
} from "./ExtensionExamplePopup";
import ExtensionExampleIcons, {
  type ExtensionExampleAction,
} from "./ExtensionExampleIcons";
import logo from "/assets/logo.svg";
import points from "/assets/icons/3-points.svg";
import cdcIconWhite from "/assets/icons/cdc-icon-white.svg";
import cdcIcon from "/assets/icons/cdc-icon.svg";
import signalIconWhite from "/assets/icons/signal-icon-white.svg";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import suggestIconWhite from "/assets/icons/suggest-icon-white.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";

import imageReport1 from "/assets/images/Landing/extensionpopupReport.svg";
import imageReport2 from "/assets/images/Landing/extensionpopupReportSearch.svg";
import imageReport3 from "/assets/images/Landing/extensionPopUpReportSearchValue.svg";
import imageReport4 from "/assets/images/Landing/extensionsReportDescription.svg";
import imageReport5 from "/assets/images/Landing/extensionPopupReportThanks.svg";
import imageReport6 from "/assets/images/Landing/extensionPopupReportSuivi.svg";
import imageReport7 from "/assets/images/Landing/extensionPopupReportSolution.svg";
import imageReport8 from "/assets/images/Landing/extensionPopupReportReponse.svg";
import imageLike1 from "/assets/images/Landing/extensionPopupLike.svg";
import imageLike2 from "/assets/images/Landing/extensionPopupLikeThanks.png";
import imageLike3 from "/assets/images/Landing/extensionPopupLikePublication.png";
import imageSuggest1 from "/assets/images/Landing/extensionPopupSuggest1.svg";
import imageSuggest2 from "/assets/images/Landing/extensionPopupSuggestThanks.png";
import imageSuggest3 from "/assets/images/Landing/extensionPopupSuggestPublication.svg";

const REPORT_STEPS = [
  imageReport1,
  imageReport2,
  imageReport3,
  imageReport4,
  imageReport5,
  imageReport6,
  imageReport5,
  imageReport7,
  imageReport5,
  imageReport8,
];

const REPORT_CURSOR_PATHS: CursorPath[][] = [
  [[{ x: "50%", y: "45%" }]],
  [[{ x: "50%", y: "77%" }]],
  [[{ x: "40%", y: "46.5%" }]],
  [
    [
      { x: "37%", y: "41%" },
      { x: "50%", y: "78%" },
    ],
  ],
  [
    [{ x: "50%", y: "59%" }],
    [{ x: "50%", y: "68%" }],
    [{ x: "50%", y: "77.5%" }],
    [{ x: "82.5%", y: "11%" }],
  ],
  [[{ x: "78%", y: "11.5%" }]],
  [
    [{ x: "50%", y: "59%" }],
    [{ x: "50%", y: "68%" }],
    [{ x: "50%", y: "77.5%" }],
    [{ x: "82.5%", y: "11%" }],
  ],
  [[{ x: "78%", y: "17%" }]],
  [
    [{ x: "50%", y: "59%" }],
    [{ x: "50%", y: "68%" }],
    [{ x: "50%", y: "77.5%" }],
    [{ x: "82.5%", y: "11%" }],
  ],
  [[{ x: "78%", y: "17%" }]],
];
const REPORT_CURSOR_VISIBILITY = [
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];
const ANIMATION_SPEED_MULTIPLIER = 0.5;
const scaleDurations = (durations: number[]) =>
  durations.map((duration) =>
    Math.max(200, Math.round(duration * ANIMATION_SPEED_MULTIPLIER)),
  );
const REPORT_STEP_DURATIONS_MS = scaleDurations([
  2000, 4500, 4500, 8000, 4500, 4500, 4500, 4500,
]);
const LIKE_STEPS = [imageLike1, imageLike2, imageLike3];
const LIKE_CURSOR_PATHS: CursorPath[][] = [
  [
    [
      { x: "40.5%", y: "37%" },
      { x: "82%", y: "81%" },
    ],
  ],
  [[{ x: "53%", y: "75%" }]],
  [[{ x: "55%", y: "75%" }]],
];
const LIKE_CURSOR_VISIBILITY = [true, true, false];
const LIKE_STEP_DURATIONS_MS = scaleDurations([5000, 4500, 4500]);
const SUGGEST_STEPS = [imageSuggest1, imageSuggest2, imageSuggest3];
const SUGGEST_CURSOR_PATHS: CursorPath[][] = [
  [
    [
      { x: "41.5%", y: "36%" },
      { x: "83%", y: "78%" },
    ],
  ],
  [[{ x: "53%", y: "77%" }]],
  [[{ x: "55%", y: "75%" }]],
];
const SUGGEST_CURSOR_VISIBILITY = [true, true, false];
const SUGGEST_STEP_DURATIONS_MS = scaleDurations([5000, 4500, 4500]);

const REPORT_STEP_ANIMATIONS: PopupAnimationPreset[] = [
  "fade",
  "fade",
  "fade",
  "slide-left",
  "fade",
  "fade",
  "fade",
  "fade",
  "fade",
  "fade",
];
const LIKE_STEP_ANIMATIONS: PopupAnimationPreset[] = [
  "fade-up",
  "fade-up",
  "fade-down",
];
const SUGGEST_STEP_ANIMATIONS: PopupAnimationPreset[] = [
  "fade-up",
  "fade-up",
  "fade-down",
];

const REPORT_STEP_ADVANCE_MODES: PopupAdvanceMode[] = [
  "auto",
  "auto",
  "click",
  "click",
  "click",
  "click",
  "click",
  "click",
  "click",
];
const LIKE_STEP_ADVANCE_MODES: PopupAdvanceMode[] = ["click", "click", "click"];
const SUGGEST_STEP_ADVANCE_MODES: PopupAdvanceMode[] = [
  "click",
  "click",
  "click",
];

const REPORT_RESTART_CLICK_TARGET: PopupClickTarget = {
  x: 79,
  y: 7,
  width: 12,
  height: 10,
  targetIndex: 0,
};

const REPORT_THANKS_CLICK_TARGETS: PopupClickTarget[] = [
  { x: 16.57, y: 54.59, width: 66.33, height: 8.62, targetIndex: 7 },
  { x: 16.57, y: 64.06, width: 66.33, height: 8.62, targetIndex: 9 },
  { x: 16.57, y: 73.53, width: 66.33, height: 8.62, targetIndex: 5 },
];

const REPORT_THANKS_WITH_RESTART: PopupClickTarget[] = [
  REPORT_RESTART_CLICK_TARGET,
  ...REPORT_THANKS_CLICK_TARGETS,
];

const REPORT_STEP_CLICK_TARGETS: PopupClickTarget[][] = [
  [],
  [],
  [],
  [],
  REPORT_THANKS_WITH_RESTART,
  [],
  REPORT_THANKS_WITH_RESTART,
  [],
  REPORT_THANKS_WITH_RESTART,
  [],
];
const LIKE_STEP_CLICK_TARGETS: PopupClickTarget[][] = [[], [], []];
const SUGGEST_STEP_CLICK_TARGETS: PopupClickTarget[][] = [[], [], []];

const DEFAULT_STEP_DURATION_MS = Math.max(
  200,
  Math.round(2200 * ANIMATION_SPEED_MULTIPLIER),
);

const STEPS_BY_SCENARIO: Record<ExtensionScenario, string[]> = {
  signalez: REPORT_STEPS,
  félicitez: LIKE_STEPS,
  suggérez: SUGGEST_STEPS,
};

const CURSOR_PATHS_BY_SCENARIO: Record<ExtensionScenario, CursorPath[][]> = {
  signalez: REPORT_CURSOR_PATHS,
  félicitez: LIKE_CURSOR_PATHS,
  suggérez: SUGGEST_CURSOR_PATHS,
};

const REPORT_STAY_ON_STEPS = [4, 6, 9];
const STAY_ON_STEPS_BY_SCENARIO: Record<ExtensionScenario, number[]> = {
  signalez: REPORT_STAY_ON_STEPS,
  félicitez: [],
  suggérez: [],
};
const STAY_TARGET_INDEX_BY_SCENARIO: Record<ExtensionScenario, number> = {
  signalez: 4,
  félicitez: 0,
  suggérez: 0,
};

const CURSOR_VISIBILITY_BY_SCENARIO: Record<ExtensionScenario, boolean[]> = {
  signalez: REPORT_CURSOR_VISIBILITY,
  félicitez: LIKE_CURSOR_VISIBILITY,
  suggérez: SUGGEST_CURSOR_VISIBILITY,
};

const STEP_DURATIONS_BY_SCENARIO: Record<ExtensionScenario, number[]> = {
  signalez: REPORT_STEP_DURATIONS_MS,
  félicitez: LIKE_STEP_DURATIONS_MS,
  suggérez: SUGGEST_STEP_DURATIONS_MS,
};

const POPUP_STEP_ANIMATIONS_BY_SCENARIO: Record<
  ExtensionScenario,
  PopupAnimationPreset[]
> = {
  signalez: REPORT_STEP_ANIMATIONS,
  félicitez: LIKE_STEP_ANIMATIONS,
  suggérez: SUGGEST_STEP_ANIMATIONS,
};

const POPUP_STEP_ADVANCE_MODES_BY_SCENARIO: Record<
  ExtensionScenario,
  PopupAdvanceMode[]
> = {
  signalez: REPORT_STEP_ADVANCE_MODES,
  félicitez: LIKE_STEP_ADVANCE_MODES,
  suggérez: SUGGEST_STEP_ADVANCE_MODES,
};

const POPUP_STEP_CLICK_TARGETS_BY_SCENARIO: Record<
  ExtensionScenario,
  PopupClickTarget[][]
> = {
  signalez: REPORT_STEP_CLICK_TARGETS,
  félicitez: LIKE_STEP_CLICK_TARGETS,
  suggérez: SUGGEST_STEP_CLICK_TARGETS,
};

type Props = {
  /** Scénario sélectionné (contrôlé) */
  selected: ExtensionScenario;
  /** Callback si tu veux piloter depuis le parent. Si non fourni, le composant gère l'état local. */
  onSelect?: (s: ExtensionScenario) => void;
  /** Choix du mode d'avance: auto ou click. */
  advanceMode?: PopupAdvanceMode;
};

const ExtensionExampleImage = ({
  selected,
  onSelect,
  advanceMode = "click",
}: Props) => {
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
  const actions: ExtensionExampleAction[] = [
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
        <ExtensionExamplePopup
          activeKey={current}
          modeClass={config.modeClass}
          stepsByScenario={STEPS_BY_SCENARIO}
          stepDurationsByScenario={STEP_DURATIONS_BY_SCENARIO}
          cursorPathsByScenario={CURSOR_PATHS_BY_SCENARIO}
          cursorVisibilityByScenario={CURSOR_VISIBILITY_BY_SCENARIO}
          popupAnimationPresetsByScenario={POPUP_STEP_ANIMATIONS_BY_SCENARIO}
          advanceModesByScenario={POPUP_STEP_ADVANCE_MODES_BY_SCENARIO}
          clickTargetsByScenario={POPUP_STEP_CLICK_TARGETS_BY_SCENARIO}
          defaultStepDurationMs={DEFAULT_STEP_DURATION_MS}
          fallbackPopupSrc={config.popup}
          ariaLabel="Étape suivante"
          advanceMode={advanceMode}
          stayOnStepsByScenario={STAY_ON_STEPS_BY_SCENARIO}
          stayTargetIndexByScenario={STAY_TARGET_INDEX_BY_SCENARIO}
        />

        <ExtensionExampleIcons
          current={current}
          onSelect={handleSelect}
          actions={actions}
          logoSrc={logo}
          optionsSrc={points}
        />
      </div>
    </div>
  );
};

export default ExtensionExampleImage;

import ImgReport from "/assets/images/Landing/webImgReport.svg";
import ImgLike from "/assets/images/Landing/likeBackgroundWebImg.svg";
import ImgSuggest from "/assets/images/Landing/suggestBackgroundWebImg.svg";

import ExtensionBarSignalement from "/assets/images/Landing/extensionBarReport.svg";
import ExtensionBarLike from "/assets/images/Landing/extensionBarLike.svg";
import ExtensionBarSuggest from "/assets/images/Landing/extensionBarSuggest.svg";

import ExtensionPopupReport from "/assets/images/Landing/extensionPopupReportReponse.svg";
import ExtensionPopupLike from "/assets/images/Landing/extensionPopupLikePublication.png";
import ExtensionPopupSuggest from "/assets/images/Landing/extensionPopupSuggest.png";
import type { ExtensionScenario } from "@src/pages/newHome/components/extensionExample/extensionExample.types";

export const EXTENSION_SCENARIO_CONFIG: Record<
  ExtensionScenario,
  {
    popup: string;
    bar: string;
    background: string;
    modeClass: string;
    bgClass: string;
  }
> = {
  signalez: {
    popup: ExtensionPopupReport,
    bar: ExtensionBarSignalement,
    background: ImgReport,
    modeClass: "report-mode",
    bgClass: "report-bg-mode",
  },
  félicitez: {
    popup: ExtensionPopupLike,
    bar: ExtensionBarLike,
    background: ImgLike,
    modeClass: "like-mode",
    bgClass: "like-bg-mode",
  },
  suggérez: {
    popup: ExtensionPopupSuggest,
    bar: ExtensionBarSuggest,
    background: ImgSuggest,
    modeClass: "suggestion-mode",
    bgClass: "suggestion-bg-mode",
  },
};

import { useEffect, useState } from "react";
import "./ExtensionExampleImage.scss";
import ExtensionTabSignalementBase from "/assets/images/Landing/extensionsReportDescription.svg";
import ExtensionTabSingalementSearch from "/assets/images/Landing/extensionpopupReportSearch.svg";
import ExtensionTabSingalementSearchValue from "/assets/images/Landing/extensionPopUpReportSearchValue.svg";
import ExtensionTabSingalementThanks from "/assets/images/Landing/extensionPopupReportThanks.svg";
import ExtensionPopupReportReponse from "/assets/images/Landing/extensionPopupReportReponse.svg";
import ExtensionPopupReportSolution from "/assets/images/Landing/extensionPopupReportSolution.svg";
import ExtensionPopupReportSuivi from "/assets/images/Landing/extensionPopupReportSuivi.svg";
import ImgReport from "/assets/images/Landing/webImgReport.svg";
import ExtensionBarSignalement from "/assets/images/Landing/extensionBarReport.svg";
import ExtensionBarLike from "/assets/images/Landing/extensionBarLike.svg";
import ExtensionPopupLike from "/assets/images/Landing/extensionPopupLike.svg";
import ExtensionPopupLikeThanks from "/assets/images/Landing/extensionPopupLikeThanks.png";
import ExtensionPopupLikePublication from "/assets/images/Landing/extensionPopupLikePublication.png";
import ImgLike from "/assets/images/Landing/likeBackgroundWebImg.svg";
import ExtensionBarSuggest from "/assets/images/Landing/extensionBarSuggest.svg";
import ExtensionPopupSuggest from "/assets/images/Landing/extensionPopupSuggest.png";
import ExtensionPopupSuggestThanks from "/assets/images/Landing/extensionPopupSuggestThanks.png";
import ExtensionPopupSuggestPublication from "/assets/images/Landing/extensionPopupSuggestPublication.svg";
import ImgSuggest from "/assets/images/Landing/suggestBackgroundWebImg.svg";
import type { ExtensionScenario } from "../extensionExample.types";

const etapePopUpExtensionReport: string[] = [
  ExtensionTabSignalementBase,
  ExtensionTabSingalementSearch,
  ExtensionTabSingalementSearchValue,
  ExtensionTabSingalementThanks,
  ExtensionPopupReportReponse,
  ExtensionPopupReportSolution,
  ExtensionPopupReportSuivi,
];

const etapePopUpExtensionLike: string[] = [
  ExtensionPopupLike,
  ExtensionPopupLikeThanks,
  ExtensionPopupLikePublication,
];

const etapePopUpExtensionSuggest: string[] = [
  ExtensionPopupSuggest,
  ExtensionPopupSuggestThanks,
  ExtensionPopupSuggestPublication,
];

const etapePopupsByScenario: Record<ExtensionScenario, string[]> = {
  signalez: etapePopUpExtensionReport,
  félicitez: etapePopUpExtensionLike,
  suggérez: etapePopUpExtensionSuggest,
};

const etapeBarExtension: Record<ExtensionScenario, string> = {
  signalez: ExtensionBarSignalement,
  félicitez: ExtensionBarLike,
  suggérez: ExtensionBarSuggest,
};

const STEP_DURATION_MS = 2200;

type ExtensionExampleImageProps = {
  selected: ExtensionScenario;
};

const ExtensionExampleImage = ({ selected }: ExtensionExampleImageProps) => {
  const [etape, setEtape] = useState<number>(0);
  const etapePopUps = etapePopupsByScenario[selected];
  const totalEtapes = etapePopUps.length;
  const safeEtapeIndex = Math.min(etape, totalEtapes - 1);
  const stepKey = `${selected}-${safeEtapeIndex}`;

  useEffect(() => {
    setEtape(0);
  }, [selected]);

  useEffect(() => {
    if (totalEtapes <= 1) return;

    const timer = setInterval(() => {
      setEtape((prevEtape) => (prevEtape + 1) % totalEtapes);
    }, STEP_DURATION_MS);

    return () => clearInterval(timer);
  }, [totalEtapes, selected]);

  let addClass = "";
  let addBgClass = "";
  let imgBackground = "";
  if (selected === "suggérez") {
    addClass = "suggestion-mode e" + etape;
    imgBackground = ImgSuggest;
    addBgClass = "suggestion-bg-mode";
  } else if (selected === "félicitez") {
    addClass = "like-mode e" + etape;
    imgBackground = ImgLike;
    addBgClass = "like-bg-mode";
  } else {
    addClass = "report-mode e" + etape;
    imgBackground = ImgReport;
    addBgClass = "report-bg-mode";
  }

  return (
    <div className="extension-example-image">
      <div className={"imgWebExample " + addBgClass}>
        <img
          src={imgBackground}
          alt="Extension Example"
          className="web-image"
        />
      </div>
      <div className="extensionImg">
        <img
          key={stepKey}
          src={etapePopUps[safeEtapeIndex]}
          alt="Extension popup Example"
          // className={"extension-image " + addClass}
          className={"extension-image step-animation " + addClass}
        />
        <img
          src={etapeBarExtension[selected]}
          alt="Extension bar Example"
          className={"extension-image-bar " + addClass}
        />
      </div>
    </div>
  );
};

export default ExtensionExampleImage;

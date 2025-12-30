import { ChevronDown } from "lucide-react";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-head.svg";
import suggestGreenIcon from "/assets/icons/suggest-head.svg";
import UofUsearly from "/assets/icons/bigUofUsearlyWithBorder.svg";

import "./ScoreIndicators.scss";

const ScoreIndicators = () => {
  return (
    <div className="bg-header px-8 py-4 -mx-8 -mt-6 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span>
          <img
            className="absolute -top-full z-1"
            src={UofUsearly}
            alt="Logo Usearly"
          />
        </span>
        <h1 className="text-xl font-semibold text-white z-2">Hello Léa !</h1>
      </div>
      <div className="input-header flex items-center gap-2 bg-transparent px-3 py-1.5 text-sm z-2">
        <span className="text-white/80 text-xs">Derniers 24h</span>
        <ChevronDown className="w-3 h-3 text-white/60" />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">820</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <img src={reportYellowIcon} alt="icone Report" />
          </div>
          <span className="text-xs text-emerald-400 ml-1">↗ +2%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">37</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <img src={likeRedIcon} alt="icone Report" />
          </div>
          <span className="text-xs text-red-400 ml-1">↘ -20%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">12</span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center">
            <img src={suggestGreenIcon} alt="icone Report" />
          </div>
          <span className="text-xs text-emerald-400 ml-1">↗ +45%</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreIndicators;

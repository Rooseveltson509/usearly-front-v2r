import type { ExtensionScenario } from "../extensionExample.types";

export type ExtensionExampleAction = {
  key: ExtensionScenario;
  wrapperClass: string;
  alt: string;
  srcInactive: string;
  srcActive: string;
  testId: string;
};

type ExtensionExampleIconsProps = {
  current: ExtensionScenario;
  onSelect: (key: ExtensionScenario) => void;
  actions: ExtensionExampleAction[];
  logoSrc: string;
  optionsSrc: string;
};

const ExtensionExampleIcons = ({
  current,
  onSelect,
  actions,
  logoSrc,
  optionsSrc,
}: ExtensionExampleIconsProps) => {
  return (
    <div className="extension-icons">
      <div className="extension-logo-icon">
        <img src={logoSrc} alt="" />
      </div>

      <div className="drag-area" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="6"
          viewBox="0 0 14 6"
          fill="none"
        >
          {[1, 5, 9, 13].flatMap((cx) => [
            <circle key={`${cx}-top`} cx={cx} cy={1} r={1} fill="#D9D9D9" />,
            <circle key={`${cx}-bottom`} cx={cx} cy={5} r={1} fill="#D9D9D9" />,
          ])}
        </svg>
      </div>

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
              onClick={() => onSelect(key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(key);
                }
              }}
            >
              <img src={active ? srcActive : srcInactive} alt={alt} />
            </div>
          );
        },
      )}

      <div className="extension-options-icon">
        <img src={optionsSrc} alt="" />
      </div>
    </div>
  );
};

export default ExtensionExampleIcons;

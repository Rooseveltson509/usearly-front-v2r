import React from "react";
import { ChevronDown } from "lucide-react";

type TriggerProps = React.HTMLAttributes<HTMLSpanElement> & {
  leading?: React.ReactNode;
  label: string;
};

export const Trigger = React.forwardRef<HTMLSpanElement, TriggerProps>(
  (
    {
      leading,
      label,
      className = "",
      style,
      ["aria-hidden"]: ariaHiddenProp,
      ...rest
    },
    ref,
  ) => {
    const ariaHidden = ariaHiddenProp ?? true;
    const classes = ["select-filter-display", className]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        aria-hidden={ariaHidden}
        style={style}
        {...rest}
      >
        <span className="select-filter-content">
          {leading && <span className="select-filter-leading">{leading}</span>}
          <span className="select-filter-label">{label}</span>
        </span>
        <ChevronDown size={16} className="select-filter-chevron" />
      </span>
    );
  },
);

Trigger.displayName = "SelectFilterTrigger";

export default Trigger;

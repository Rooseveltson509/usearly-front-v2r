import { ChevronDown } from "lucide-react";

type TriggerProps = {
  leading?: React.ReactNode;
  label: string;
  //   disabled?: boolean;
};

export function Trigger({ leading, label }: TriggerProps) {
  return (
    <span className="select-filter-display" aria-hidden>
      <span className="select-filter-content">
        {leading && <span className="select-filter-leading">{leading}</span>}
        <span className="select-filter-label">{label}</span>
      </span>
      <ChevronDown size={16} className="select-filter-chevron" />
    </span>
  );
}

export default Trigger;

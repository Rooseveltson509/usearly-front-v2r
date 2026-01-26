import type { ReactElement } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@src/components/ui/tooltip";

const CellTooltip = ({
  tooltip,
  children,
}: {
  tooltip: string;
  children: ReactElement;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent align="center">{tooltip}</TooltipContent>
  </Tooltip>
);

export default CellTooltip;

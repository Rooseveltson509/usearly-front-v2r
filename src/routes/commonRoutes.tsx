import type { RouteObject } from "react-router-dom";

export const commonRoutes: RouteObject[] = [
  {
    path: "*",
    element: <div>404 - Page non trouvée</div>,
  },
];

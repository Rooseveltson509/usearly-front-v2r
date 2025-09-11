import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { authRoutes } from "./authRoutes";
import { userRoutes } from "./userRoutes";
import { commonRoutes } from "./commonRoutes";

// Skeleton global
const Fallback = () => (
  <div style={{
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  }}>
    Chargement...
  </div>
);

const AppRoutes = () => {
  const allRoutes = [...authRoutes, ...userRoutes, ...commonRoutes];

  return (
    // ✅ Le Suspense est ici seulement, donc Layout continue d’englober tout
    <Suspense fallback={<Fallback />}>
      <Routes>
        {allRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
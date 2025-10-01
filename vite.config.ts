import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ← 👈 Ajout nécessaire

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"), // ← 👈 Alias @src configuré
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
});

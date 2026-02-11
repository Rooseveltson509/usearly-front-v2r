import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({
      filename: "dist/stats.html",
      open: true, // ouvre automatiquement le rapport
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },
  server: {
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    copyPublicDir: true, // Asegura que los archivos de public/ se copien a dist/
  },
});

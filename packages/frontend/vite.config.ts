import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import purgeIcons from "vite-plugin-purge-icons";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), purgeIcons(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    cssCodeSplit: true,
    outDir: "dist",
    assetsDir: "assets",
  },
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/node_modules/@vitejs/plugin-react/dist/index.mjs";
import autoprefixer from "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/node_modules/autoprefixer/lib/autoprefixer.js";
import tailwindcss from "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/node_modules/tailwindcss/lib/index.js";
import purgeIcons from "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/node_modules/vite-plugin-purge-icons/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/hazim/OneDrive/Desktop/Coding%20Stuff/nabil-attendance-system/frontend/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [react(), purgeIcons()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  build: {
    cssCodeSplit: true,
    outDir: "dist",
    assetsDir: "assets"
  },
  resolve: {
    alias: {
      "@": new URL("src", __vite_injected_original_import_meta_url).pathname
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxoYXppbVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXENvZGluZyBTdHVmZlxcXFxuYWJpbC1hdHRlbmRhbmNlLXN5c3RlbVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaGF6aW1cXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxDb2RpbmcgU3R1ZmZcXFxcbmFiaWwtYXR0ZW5kYW5jZS1zeXN0ZW1cXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2hhemltL09uZURyaXZlL0Rlc2t0b3AvQ29kaW5nJTIwU3R1ZmYvbmFiaWwtYXR0ZW5kYW5jZS1zeXN0ZW0vZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ3RhaWx3aW5kY3NzJztcbmltcG9ydCBwdXJnZUljb25zIGZyb20gXCJ2aXRlLXBsdWdpbi1wdXJnZS1pY29uc1wiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHB1cmdlSWNvbnMoKV0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdGFpbHdpbmRjc3MsXG4gICAgICAgIGF1dG9wcmVmaXhlclxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogbmV3IFVSTCgnc3JjJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJhLFNBQVMsb0JBQW9CO0FBQ3hjLE9BQU8sV0FBVztBQUNsQixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGdCQUFnQjtBQUowUCxJQUFNLDJDQUEyQztBQU9sVSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztBQUFBLEVBQy9CLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssSUFBSSxJQUFJLE9BQU8sd0NBQWUsRUFBRTtBQUFBLElBQ3ZDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

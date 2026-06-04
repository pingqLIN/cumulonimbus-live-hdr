import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    // The Three.js preview renderer is lazy-loaded; keep the warning budget above that split chunk.
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      input: {
        main: "index.html",
        model: "cumulonimbus-live-hdr-mainline.html"
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});

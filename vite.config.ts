import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    // The Three.js preview renderer is lazy-loaded; keep the warning budget above that split chunk.
    chunkSizeWarningLimit: 650
  },
  server: {
    port: 5173,
    strictPort: false
  }
});

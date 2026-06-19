import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  },
  server: {
    allowedHosts: [".trycloudflare.com", ".lhr.life"],
    port: 5173,
    strictPort: false
  }
});

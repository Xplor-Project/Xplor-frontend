import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          fiber: ["@react-three/fiber"],
          drei: ["@react-three/drei"],
        },
      },
    },

    // Optional: raise warning limit for 3D apps
    chunkSizeWarningLimit: 1500,
  },
});

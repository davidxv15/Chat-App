import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003, // Frontend port
    proxy: {
      "/api": process.env.VITE_API_URL || "http://localhost:3001", // Fallback to localhost if VITE_API_URL is undefined
  },
},
  plugins: [react()],
});

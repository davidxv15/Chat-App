import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003, // Frontend port
    proxy: {
      "/api": "http://localhost:3001", // proxy API requests to backend on port 3001

  },
},
  plugins: [react()],
});

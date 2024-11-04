import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3003, // Frontend port
    proxy: {
      "/api": import.meta.env.VITE_API_URL, // proxy API requests to backend on port 3001

  },
},
  plugins: [react()],
});

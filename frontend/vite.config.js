import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const host = process.env.VITE_HOST || "0.0.0.0";
const port = Number(process.env.VITE_PORT) || 5173;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host,
    port,
  },
});
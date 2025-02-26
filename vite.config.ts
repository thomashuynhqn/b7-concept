import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Import 'path' to define aliases

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/Api"), // Alias for API
      "@components": path.resolve(__dirname, "src/components"), // Alias for components
      "@styles": path.resolve(__dirname, "src/styles"), // Alias for styles
    },
  },
});

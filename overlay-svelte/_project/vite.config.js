import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [svelte()],
  server: {
    proxy: {
      "/overnightlive": {
        target: "ws://localhost:8080/overnightlive",
        ws: true,
      },
    },
  },
});

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "url"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",

  build: {
    outDir: "../dist",
    assetsDir: "./static",
    minify: true,
    rollupOptions: {
      input: {
        main: "./src/index.html",
      },
    },
  },
  server: {
    cors: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@server": fileURLToPath(new URL("./server", import.meta.url)),
    },
  },
})

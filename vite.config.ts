import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "url"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",

  build: {
    outDir: "../build",
    assetsDir: "./static",
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: {
        main: "./src/index.html",
      },
    },
  },
  server: {
    cors: true,
    port: 3000,
    host: "0.0.0.0"
  },
  plugins: [
    svgr({
      svgrOptions: {
        exportType: "default",
      },
      include: "**/*.svg"
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@server": fileURLToPath(new URL("./server", import.meta.url)),
    },
  },
})

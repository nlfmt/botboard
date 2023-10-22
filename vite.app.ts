import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "url"
import svgr from "vite-plugin-svgr"

const alias = (path: string) => fileURLToPath(new URL(path, import.meta.url))


// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",

  build: {
    outDir: "../build",
    assetsDir: "./static",
    emptyOutDir: false,
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
      "@": alias("./src"),
      "@server": alias("./server"),
    },
  },
})

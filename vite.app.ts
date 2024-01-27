import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "url"
import svgr from "vite-plugin-svgr"
import { VitePWA } from "vite-plugin-pwa"

const alias = (path: string) => fileURLToPath(new URL(path, import.meta.url))


// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  publicDir: "../public",

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
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [
    svgr({
      svgrOptions: {
        exportType: "default",
      },
      include: "**/*.svg"
    }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      outDir: "../build/static",
      devOptions: {
        enabled: false,
      },
      base: "/static/",
      workbox: {
        navigateFallback: "/",
      },
      manifestFilename: "manifest.json",
      manifest: {
        theme_color: "#101010",
        background_color: "#101010",
        scope: "/",
        start_url: "/",
        display: "standalone",

        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": alias("./src"),
      "@server": alias("./server"),
    },
  },

  optimizeDeps: {
    force: true,
  }
})

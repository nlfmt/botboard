import { defineConfig } from "vite"
import { fileURLToPath } from "url"
import { VitePluginNode } from "vite-plugin-node"

const alias = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  build: {
    outDir: "./build",
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      input: {
        main: "./server/server.ts",
      },
    },
  },
  server: {
    cors: true,
    port: 3001,
  },
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./server/server.ts",
      tsCompiler: "swc",
    }),
  ],
  resolve: {
    alias: {
      "@": alias("./server"),
    },
  },
})

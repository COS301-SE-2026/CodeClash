import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./@"),
      "root": path.resolve(__dirname, "../",),
      "src":path.resolve(__dirname,"./src")
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  },
  optimizeDeps: {
    exclude: ['@monaco-aditor/react'],
  },
})

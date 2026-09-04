import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
// eslint-disable-next-line import/no-duplicates
import { defineConfig, mergeConfig  } from 'vite'
// eslint-disable-next-line import/no-duplicates
import { defineConfig as defineVitestConfig } from 'vitest/config'

dotenv.config();

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./@"),
      "root": path.resolve(__dirname, "../"),
      "src": path.resolve(__dirname, "./src")
    },
  },
  optimizeDeps: {
    exclude: ['@monaco-editor/react', 'mathlive'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  }
});

export default mergeConfig(viteConfig, defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  }
}));
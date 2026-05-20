import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv'

dotenv.config();

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
  },
});

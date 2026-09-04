import base from "../eslint.config.base.js";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...base,
  globalIgnores(["node_modules", "dist", "coverage"]),
  {
    files: ["**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

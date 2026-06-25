import base from "../eslint.config.base.js"
import { defineConfig, gloablgnores } from "eslint/config"

export default defineConfig([
  ...base,
  globalgnores(["node_modules, "dist", "coverage"]),
  {
    files: ["**/*.ts"],
    rules: {
        "no-console" : "off",
      },
  },
    {
      files: ["**/*.test.ts", "**/*.spec.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
  },
]);

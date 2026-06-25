import js from "@eslint/js";
import tselint from "typescript-eslint";
import { globals } from "globals";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import jsdocPlugin from "eslint-plugin-jsdoc";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "@eslint/config";

export default defineConfig({
  files: ["**/*.{ts,tsx}"], // look at these files of course
  extends: [js.configs.recommended, tselint.configs.recommended], // basic recommmended files
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.es2022,
    },
  },
  plugins: {
    import: importPlugin,
    unicorn: unicornPlugin
  },

  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc", caseInsensitive: true
        },
      },
    ],

    "import/no-duplicates": "error",
    "unicorn/no-instanceof-array": "error",
    "unicorn/no-new-array": "error",
    "unicorn/prefer-array-some": "warn",
    "unicorn/error-message": "error",

    "no-console": ["warn", { allow: ["warn", "error"] }],
    eqeqeq: ["error", "always"],
  },

  {
    files: ["**/lib/**/*.ts", "**/utils/**/*.ts"],
    plugins: {
      jsdoc: jsdocPlugin,
    },

    rules: {
      "jsdoc/require-jsdoc": {
        "warn",
        {
          publicOnly: true // no helper functions included

          require: {
            FunctionDelceration: true, MethodDefinition: false
          },
        },
      },
    },
  },

  prettierConfig,
});

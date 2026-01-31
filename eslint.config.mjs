import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import unusedImports from "eslint-plugin-unused-imports";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jestFormatting from "eslint-plugin-jest-formatting";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["src/vendors/integrations/api.validation/**/generated.js"]),
  {
    extends: [
      ...nextCoreWebVitals,
      ...compat.extends("plugin:@typescript-eslint/recommended"),
      ...compat.extends("plugin:jest-formatting/recommended"),
    ],

    plugins: {
      "unused-imports": unusedImports,
      "@typescript-eslint": typescriptEslint,
      "jest-formatting": jestFormatting,
    },

    languageOptions: {
      globals: {
        jest: true,
      },

      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-var-requires": "off",

      "@typescript-eslint/no-unused-vars": ["error"],

      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": "allow-with-description",
        },
      ],

      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },

          groups: [
            "external",
            "builtin",
            "sibling",
            "parent",
            "object",
            "index",
            "internal",
            "type",
          ],

          "newlines-between": "never",

          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],

          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],

      "jest-formatting/padding-around-expect-groups": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
    },
  },
]);

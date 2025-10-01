import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: ["dist", "**/*.scss"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    //files: ["**/*.{ts,tsx,js,jsx,scss,css}"], // ✅ inclure scss et css
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // ✅ hooks : on garde les règles de base
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off", // ❌ on les ignore pour le moment

      // ✅ formatter avec Prettier
      "prettier/prettier": "error",

      // ✅ variables inutilisées → obligé de les gérer
      "@typescript-eslint/no-unused-vars": ["error"],

      // ❌ on désactive le blocage sur any
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);

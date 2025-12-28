import baseEslintConfig from "@igorkowalczyk/eslint-config/base";
import nodeEslintConfig from "@igorkowalczyk/eslint-config/node";
import prettierEslintConfig from "@igorkowalczyk/eslint-config/prettier";
import typescriptEslintConfig from "@igorkowalczyk/eslint-config/typescript";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // prettier
  baseEslintConfig,
  nodeEslintConfig,
  typescriptEslintConfig,
  prettierEslintConfig,
]);

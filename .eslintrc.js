module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  overrides: [],
  extends: ["standard-with-typescript", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  parser: "@babel/eslint-parser",
  rules: {
    "react/prop-types": 0,
    "no-const-assign": "error",
    "no-duplicate-imports": "error",
    curly: 1,
    eqeqeq: 1,
    "no-nested-ternary": 1,
    "no-var": "error",
    "object-shorthand": "error",
  },
};

/** @type {import("eslint").Linter.Config[]} */
const base = [
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
    },
  },
];

export default base;

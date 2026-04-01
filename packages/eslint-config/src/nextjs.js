import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
const nextjs = [
  ...base,
  {
    rules: {
      // Next.js specific rule overrides go here
    },
  },
];

export default nextjs;

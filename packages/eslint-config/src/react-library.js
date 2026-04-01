import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
const reactLibrary = [
  ...base,
  {
    rules: {
      // React library specific rule overrides go here
    },
  },
];

export default reactLibrary;

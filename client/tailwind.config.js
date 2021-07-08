// const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: [
    "./components/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: "media", // false or 'media' or 'class'
  theme: {
    textColor: (theme) => ({
      ...theme("colors"),
      "blue-srk": "#0089ff",
      "orange-srk": "#ff7600",
    }),
    borderColor: (theme) => ({
      ...theme("colors"),
      "blue-srk": "#0089ff",
      "orange-srk": "#ff7600",
    }),
    backgroundColor: (theme) => ({
      ...theme("colors"),
      "blue-srk": "#0089ff",
      "orange-srk": "#ff7600",
    }),
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      fontWeight: ["hover", "focus", "disabled"],
    },
  },
  plugins: [
    // plugin(({ addVariant, e }) => {
    //   addVariant("not-disabled", ({ modifySelectors, separator }) => {
    //     modifySelectors(({ className }) => {
    //       return `.${e(`not-disabled${separator}${className}`)}:not(:disabled)`;
    //     });
    //   });
    // }),
  ],
};

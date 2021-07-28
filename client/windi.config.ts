import { defineConfig } from "windicss/helpers";
// import colors from "windicss/colors";

export default defineConfig({
  purge: [
    // "./components/**/*.vue",
    // "./layouts/**/*.vue",
    // "./pages/**/*.vue",
    // "./plugins/**/*.{js,ts}",
    // "./nuxt.config.{js,ts}",
  ],
  darkMode: "media", // false or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        "blue-srk": "#0089ff",
        "orange-srk": "#ff7600",
      },
      borderColor: {
        "blue-srk": "#0089ff",
        "orange-srk": "#ff7600",
      },
      backgroundColor: {
        "blue-srk": "#0089ff",
        "orange-srk": "#ff7600",
      },
    },
    // textColor: (theme) => ({
    //   ...theme("colors"),
    //   "blue-srk": "#0089ff",
    //   "orange-srk": "#ff7600",
    // }),
    // borderColor: (theme) => ({
    //   ...theme("colors"),
    //   "blue-srk": "#0089ff",
    //   "orange-srk": "#ff7600",
    // }),
    // backgroundColor: (theme) => ({
    //   ...theme("colors"),
    //   "blue-srk": "#0089ff",
    //   "orange-srk": "#ff7600",
    // }),
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
});

const path = require("path");

const isNotProductionOrTest = () =>
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

const i18n = {
  defaultLocale: "en",
  locales: ["en"],
};

module.exports = {
  debug: isNotProductionOrTest(),
  defaultNS: "main",
  keySeparator: ".",
  i18n,
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: isNotProductionOrTest(),
};

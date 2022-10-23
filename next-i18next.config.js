const path = require("path");

const isNotProductionOrTest = () =>
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

const i18n = {
  fallbackLng: {
    default: ["en"],
  },
  debug: false,
  locales: ["en"],
  defaultLocale: "en",
  defaultNS: "main",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  localePath: path.resolve("./public/locales"),
  reloadOnPrerender: isNotProductionOrTest(),
};

module.exports = {
  i18n,
};

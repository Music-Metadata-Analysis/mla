const isNotProductionOrTest = () =>
  process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";

const i18n = {
  fallbackLng: {
    default: ["en"],
  },
  debug: isNotProductionOrTest(),
  locales: ["en"],
  defaultLocale: "en",
  defaultNS: "main",
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
};

module.exports = {
  i18n,
};

const { i18n } = require("./next-i18next.config");

module.exports = {
  target: "experimental-serverless-trace",
  i18n,
  images: {
    formats: ["image/jpeg", "image/png"],
  },
};

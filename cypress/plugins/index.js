module.exports = (on) => {
  const { startDevServer } = require("@cypress/webpack-dev-server");

  const webpackConfig = require("../.webpack.cypress");
  on("dev-server:start", (options) =>
    startDevServer({ options, webpackConfig })
  );
};

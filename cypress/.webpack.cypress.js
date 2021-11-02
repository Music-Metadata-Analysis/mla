module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["next/babel"],
            },
          },
        ],
      },
    ],
  },
};

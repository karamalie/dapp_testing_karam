const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (config) => {
      // ...
      const fileLoaderRule = getFileLoaderRule(config.module.rules);
      if (!fileLoaderRule) {
        throw new Error("File loader not found");
      }
      fileLoaderRule.exclude.push(/\.cjs$/);
      // ...
      const scopePluginIndex = config.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );

      config.resolve.plugins.splice(scopePluginIndex, 1);
      config["resolve"] = {
        fallback: {
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          os: require.resolve("os-browserify"),
          url: require.resolve("url"),
          zlib: require.resolve("browserify-zlib"),
          buffer: require.resolve("buffer"),
        },
      };

      config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ];

      return config;
    },
  },
};

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ("oneOf" in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === "asset/resource") {
      return rule;
    }
  }
}

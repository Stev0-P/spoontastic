/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  modifyWebpackConfig(
    /**
     * @type {{
     *  webpackConfig: Required<webpack.Configuration>,
     *  env: { target: "node" | "web", dev: boolean },
     *  webpackObject: webpack,
     *  options: any
     * }}
     */
    {
      env: {
        target, // the target 'node' or 'web'
        dev, // is this a development build? true or false
      },
      webpackConfig, // the created webpack config
      webpackObject, // the imported webpack node module
      options: {
        razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
        webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
      },
    }
  ) {
    if (target === "web") {
      // client only
      if (!dev) {
        webpackConfig.performance = Object.assign({}, webpackConfig.performance, { hints: false });
      }
    }

    return webpackConfig;
  },
};

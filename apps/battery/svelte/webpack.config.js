const path = require('path');
const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    config.resolve.alias.set(
      '@stackblitz/nativescript-battery',
      path.resolve(__dirname, '../../../libs/nativescript-battery/src'),
    );
  });

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return webpack.resolveConfig();
};

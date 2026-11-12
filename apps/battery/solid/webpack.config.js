const path = require('path');
const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('javascript');

  webpack.chainWebpack((config) => {
    config.resolve.alias.set(
      '@stackblitz/nativescript-battery',
      path.resolve(__dirname, '../../../libs/nativescript-battery/src'),
    );
    // typescript and tsconfig.json exist only so ts-loader can compile the shared lib.
    // Type-checking it would need @nativescript/types, which this project skips.
    config.plugins.delete('ForkTsCheckerWebpackPlugin');
  });

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  return webpack.resolveConfig();
};

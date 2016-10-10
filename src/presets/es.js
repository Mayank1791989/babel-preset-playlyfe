/* @flow */
type Options = $Exact<{
  ie10: bool,
  flow: bool,
};

module.exports = (context: any, opts: Options) => ({
  presets: [
    opts.ie10
    ? require('./es2015-ie10')
    : require('babel-preset-es2015'),
  ],

  plugins: [
    // See: https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
    // https://phabricator.babeljs.io/T2645
    // NOTE: here order matters
    // and decorator should be present before transform-class-properties
    require('babel-plugin-transform-decorators-legacy').default,
    require('babel-plugin-transform-decorators'),

    require('babel-plugin-syntax-trailing-function-commas'),

    require('babel-plugin-transform-class-properties'),
    require('babel-plugin-transform-object-rest-spread'),

    require('babel-plugin-transform-export-extensions'),

    // flow support
    ...(opts.flow ? [
      require('babel-plugin-transform-flow-strip-types'),
      require('babel-plugin-syntax-flow'),
    ] : []),
  ],
});

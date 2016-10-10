/* @flow */
module.exports = (
  context: any,
  opts: { reactIntl: bool }
) => ({
  plugins: [
    // same as babel-preset-react except flow plugins (flow support is added separately see es.js)
    require('babel-plugin-transform-react-jsx'),
    require('babel-plugin-syntax-jsx'),
    require('babel-plugin-transform-react-display-name'),

    // react-intl support
    opts.reactIntl
    ? [require('../plugins/react-intl').default, { enforceDescriptions: false }]
    : null,
  ].filter(Boolean),
});

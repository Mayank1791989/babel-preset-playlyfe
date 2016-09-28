/* @flow */
module.exports = (
  context: any,
  opts: { reactIntl: bool }
) => ({
  presets: [
    require('babel-preset-react'),
  ],

  plugins: [
    opts.reactIntl
    ? [require('../plugins/react-intl').default, { enforceDescriptions: false }]
    : null,
  ].filter(Boolean),
});

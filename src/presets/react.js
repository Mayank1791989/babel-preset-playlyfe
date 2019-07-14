/* @flow */
import presetReact from '@babel/preset-react';
import pluginReactIntl from 'babel-plugin-react-intl';

export type Opts = {|
  reactIntl: boolean,
  useBuiltIns: boolean,
  development: boolean,
|};

export const DEFAULT_OPTS: Opts = Object.freeze({
  reactIntl: true,
  useBuiltIns: true,
  development: false,
});

export default (context: any, opts: Opts) => ({
  presets: [
    [
      presetReact,
      {
        development: opts.development,
        useBuiltIns: opts.useBuiltIns,
      },
    ],
  ],

  plugins: [
    // react-intl support
    opts.reactIntl
      ? [
          pluginReactIntl,
          { enforceDescriptions: false, extractFromFormatMessageCall: true },
        ]
      : null,
  ].filter(Boolean),
});

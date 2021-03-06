/* @flow */
import presetEnv from '@babel/preset-env';
import presetFlow from '@babel/preset-flow';
import transformClassProperties from '@babel/plugin-proposal-class-properties';
import transformObjectRestSpread from '@babel/plugin-proposal-object-rest-spread';

export type Opts = {|
  flow: boolean,
  asyncAwait: boolean,
  modules: 'amd' | 'umd' | 'systemjs' | 'commonjs' | false,
  targets: Object,
  useBuiltIns: boolean,
  debug: boolean,
|};

export const DEFAULT_OPTS: Opts = Object.freeze({
  flow: true,
  asyncAwait: false,
  modules: 'commonjs',
  targets: {},
  useBuiltIns: true,
  debug: false,
});

export default (context: any, opts: Opts) => {
  const { targets, modules, debug, useBuiltIns, asyncAwait } = opts;

  return {
    presets: [
      [
        presetEnv,
        {
          targets,
          modules,
          debug,
          useBuiltIns: useBuiltIns ? 'entry' : false,
          corejs: 3,
          // only enable generator when asyncAwait enabled
          exclude: !asyncAwait // eslint-disable-line no-negated-condition
            ? ['transform-regenerator', 'transform-async-to-generator']
            : [],
        },
      ],
      opts.flow ? presetFlow : null,
    ],

    plugins: [
      // add class properties support
      // NOTE: keeping loose: true see issue: https://github.com/facebook/create-react-app/issues/4263
      [transformClassProperties, { loose: true }],

      // add object rest spread support
      // keeping useBuiltIns: true & loose: false to use Object.assign which is fine for our use case
      [transformObjectRestSpread, { useBuiltIns: true, loose: true }],
    ].filter(Boolean),
  };
};

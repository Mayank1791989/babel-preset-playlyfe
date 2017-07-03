/* @flow */
import presetEnv from 'babel-preset-env';
import transformDecoratorsLegacy from 'babel-plugin-transform-decorators-legacy';
import transformDecorators from 'babel-plugin-transform-decorators';
import transformClassProperties from 'babel-plugin-transform-class-properties';
import transformObjectRestSpread from 'babel-plugin-transform-object-rest-spread';
import transformFlowStripTypes from 'babel-plugin-transform-flow-strip-types';
import syntaxFlow from 'babel-plugin-syntax-flow';
import syntaxDynamicImport from 'babel-plugin-syntax-dynamic-import';

export type Opts = {
  flow: boolean,
  asyncAwait: boolean,
  dynamicImport: boolean,
  modules: 'amd' | 'umd' | 'systemjs' | 'commonjs' | false,
  targets: Array<any>,
  decorators: boolean,
  useBuiltIns: boolean,
  debug: boolean,
};

export const DEFAULT_OPTS: Opts = {
  flow: true,
  asyncAwait: false,
  dynamicImport: false,
  modules: 'commonjs',
  targets: [],
  decorators: false,
  useBuiltIns: true,
  debug: false,
};

export default (context: any, opts: Opts) => {
  const { targets, modules, debug, useBuiltIns } = opts;

  return {
    presets: [
      [
        presetEnv,
        {
          targets,
          modules,
          debug,
          useBuiltIns,
          // only enable generator when asyncAwait enabled
          exclude: !opts.asyncAwait // eslint-disable-line no-negated-condition
            ? ['transform-regenerator', 'transform-async-to-generator']
            : [],
        },
      ],
    ],

    plugins: [
      opts.dynamicImport ? syntaxDynamicImport : null,
      // See: https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
      // https://phabricator.babeljs.io/T2645
      // NOTE: here order matters
      // and decorator should be present before transform-class-properties
      ...(opts.decorators
        ? [transformDecoratorsLegacy, transformDecorators]
        : []),

      transformClassProperties,
      [transformObjectRestSpread, { useBuiltIns: true }],

      // flow support
      ...(opts.flow ? [transformFlowStripTypes, syntaxFlow] : []),
    ].filter(Boolean),
  };
};

/* @flow */
import presetES, {
  DEFAULT_OPTS as PRESET_ES_DEFAULT_OPTS,
  type Opts as PresetESOpts,
} from './presets/es';
import presetReact, {
  DEFAULT_OPTS as PRESET_REACT_DEFAULT_OPTS,
  type Opts as PresetReactOpts,
} from './presets/react';
import _pick from 'lodash/pick';

import transformRuntime from '@babel/plugin-transform-runtime';

import { reify, type Type } from 'flow-runtime';

const DEFAULT_OPTS = Object.freeze({
  ...PRESET_ES_DEFAULT_OPTS,
  ...PRESET_REACT_DEFAULT_OPTS,
  react: true,
  babelRuntime: true,
});

export type Opts = PresetESOpts &
  PresetReactOpts & { react: boolean, babelRuntime: boolean };

export default (context: any, opts?: ?$Shape<Opts>) => {
  // eslint-disable-next-line no-use-before-define
  const options = {
    ...DEFAULT_OPTS,
    ...opts,
  };

  validateOpts(options);

  const presetESOpts = _pick(options, Object.keys(PRESET_ES_DEFAULT_OPTS));
  const presetReactOpts = _pick(
    options,
    Object.keys(PRESET_REACT_DEFAULT_OPTS),
  );

  return {
    presets: [
      [presetES, presetESOpts],
      options.react ? [presetReact, presetReactOpts] : null,
    ].filter(Boolean),

    plugins: [
      // to avoid duplicate babel helpers code
      options.babelRuntime
        ? [transformRuntime, { useESModules: options.modules === false }]
        : null,
    ].filter(Boolean),
  };
};

function validateOpts(opts) {
  const OptsType = (reify: Type<$Exact<Opts>>);
  OptsType.assert(opts);
}

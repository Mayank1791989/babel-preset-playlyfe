/* @flow */
import presetES, {
  DEFAULT_OPTS as PRESET_ES_DEFAULT_OPTS,
  type Opts as PresetESOpts,
} from './presets/es';
import presetReact, {
  DEFAULT_OPTS as PRESET_REACT_DEFAULT_OPTS,
  type Opts as PresetReactOpts,
} from './presets/react';

import transformRuntime from 'babel-plugin-transform-runtime';
import { reify, type Type } from 'flow-runtime';
import _pick from 'lodash/pick';

const DEFAULT_OPTS = {
  ...PRESET_ES_DEFAULT_OPTS,
  ...PRESET_REACT_DEFAULT_OPTS,
  react: true,
  babelRuntime: true,
};

type Opts = PresetESOpts &
  PresetReactOpts & { react: boolean, babelRuntime: boolean };

export default (context: any, opts?: ?$Shape<Opts>) => {
  // eslint-disable-next-line no-use-before-define
  checkForUnknownOpts(opts, DEFAULT_OPTS);

  const options = {
    ...DEFAULT_OPTS,
    ...opts,
  };

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
      options.babelRuntime ? transformRuntime : null,
    ].filter(Boolean),
  };
};

function checkForUnknownOpts(opts?: ?Object, availableOpts: Object) {
  if (!opts) {
    return;
  }
  // check unknown options
  Object.keys(opts).forEach(opt => {
    if (!(opt in availableOpts)) {
      const optType = (reify: Type<Opts>);

      // missing
      throw new Error(
        `unknown option passed '${opt}'` +
          '\nAvailable opts' +
          `\n${optType.unwrap().toString()}`,
      );
    }
  });
}

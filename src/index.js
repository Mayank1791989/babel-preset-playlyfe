/* @flow */
const DEFAULT_OPTS = {
  ie10: false,
  react: true,
  reactIntl: true,
  babelRuntime: true,
  flow: true,
  asyncAwait: false,
};

type Options = ?$Exact<{
  ie10?: bool,
  react?: bool,
  reactIntl?: bool,
  babelRuntime?: bool,
  flow?: bool,
  asyncAwait?: bool,
}>;

module.exports = (context: any, opts: Options) => {
  validateOptions(opts || {}); // eslint-disable-line no-use-before-define

  const {
    ie10, react, reactIntl,
    babelRuntime, flow, asyncAwait,
  } = { ...DEFAULT_OPTS, ...(opts || {}) };

  return {
    presets: [
      [require('./presets/es'), { ie10, flow, asyncAwait }],
      react ? [require('./presets/react'), { reactIntl }] : null,
    ].filter(Boolean),

    plugins: [
      // to avoid duplicate babel helpers code
      babelRuntime ? require('babel-plugin-transform-runtime') : null,
    ].filter(Boolean),
  };
};

function printOptionsHelp() {
  const options = Object.keys(DEFAULT_OPTS).map(key => (
    `${key}: ${typeof DEFAULT_OPTS[key]}`
  ));
  return `Support options [${options.join(', ')}]`;
}

function validateOptions(opts) {
  // check unknown options
  Object.keys(opts).forEach((opt) => {
    if (!(opt in DEFAULT_OPTS)) { // missing
      throw new Error(`unknown option passed '${opt}'. ${printOptionsHelp()}`);
    }

    const actualType = typeof opts[opt];
    const expectedType = typeof DEFAULT_OPTS[opt];
    if (actualType !== expectedType) {
      throw new Error(`'${opt} (value: ${JSON.stringify(opts[opt])})' must be of type '${expectedType}'`);
    }
  });
}

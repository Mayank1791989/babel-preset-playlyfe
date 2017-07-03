/* @flow */
import transformReactJSX from 'babel-plugin-transform-react-jsx';
import transformSyntaxJSX from 'babel-plugin-syntax-jsx';
import transformReactDisplayName from 'babel-plugin-transform-react-display-name';
import transformReactJSXSource from 'babel-plugin-transform-react-jsx-source';
import transformReactJSXSelf from 'babel-plugin-transform-react-jsx-self';

import pluginReactIntl from '../plugins/react-intl';

export type Opts = {
  reactIntl: boolean,
};

export const DEFAULT_OPTS: Opts = {
  reactIntl: true,
};

export default (context: any, opts: Opts) => ({
  plugins: [
    // same as babel-preset-react except flow plugins (flow support is added separately see es.js)
    [transformReactJSX, { useBuiltIns: true }],
    transformSyntaxJSX,
    transformReactDisplayName,

    // enable react debug plugin if env is not proc
    // eslint-disable-next-line no-negated-condition
    ...(process.env.NODE_ENV !== 'production'
      ? [transformReactJSXSource, transformReactJSXSelf]
      : []),

    // react-intl support
    opts.reactIntl ? [pluginReactIntl, { enforceDescriptions: false }] : null,
  ].filter(Boolean),
});

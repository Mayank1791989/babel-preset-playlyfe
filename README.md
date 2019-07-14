[![Travis](https://img.shields.io/travis/Mayank1791989/babel-preset-playlyfe.svg?style=flat-square)](https://travis-ci.org/Mayank1791989/babel-preset-playlyfe)
[![Codecov](https://img.shields.io/codecov/c/github/Mayank1791989/babel-preset-playlyfe.svg?style=flat-square)](https://codecov.io/gh/Mayank1791989/babel-preset-playlyfe)
[![npm](https://img.shields.io/npm/v/babel-preset-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/babel-preset-playlyfe)
[![npm](https://img.shields.io/npm/dt/babel-preset-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/babel-preset-playlyfe)

# babel-preset-playlyfe

> Babel preset for Javascript(es2015, es2016) React projects.

## Install

```sh
$ npm install --save-dev babel-preset-playlyfe
$ yarn add --dev babel-preset-playlyfe
```

## Usage

```javascript
// .babelrc
{
  "presets": ["playlyfe", options]
}
```

## Options

* `flow` - bool (default true) Enable flow support.
* `modules` - 'amd' | 'umd' | 'systemjs' | 'commonjs' | false (default 'commonjs').
* `targets` - same as babel-preset-env [targets option](https://github.com/babel/babel-preset-env#options)
* `useBuiltIns` - (default: true) same as babel-preset-env [useBuiltIns option](https://github.com/babel/babel-preset-env#options)
* `asyncAwait` - bool (default false) Enable async-await support (Note: need [regeneratorRuntime](https://babeljs.io/docs/plugins/transform-regenerator)).

* `react` - bool (default true) Enable react support.
* `reactIntl` - bool (default true) Enable react-intl support.

* `babelRuntime` - bool (default true) Enable [babel-plugin-transform-runtime plugin](https://babeljs.io/docs/plugins/transform-runtime).

* `development` - bool (default false) to enable dev mode

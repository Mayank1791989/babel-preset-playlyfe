[![Travis](https://img.shields.io/travis/Mayank1791989/babel-preset-playlyfe.svg?style=flat-square)](https://travis-ci.org/Mayank1791989/babel-preset-playlyfe)
[![Codecov](https://img.shields.io/codecov/c/github/Mayank1791989/babel-preset-playlyfe.svg?style=flat-square)](https://codecov.io/gh/Mayank1791989/babel-preset-playlyfe)
[![npm](https://img.shields.io/npm/v/babel-preset-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/babel-preset-playlyfe)
[![npm](https://img.shields.io/npm/dt/babel-preset-playlyfe.svg?style=flat-square)](https://www.npmjs.com/package/babel-preset-playlyfe)

# babel-preset-playlyfe

> Babel preset for Javascript(es2015, es2016) React projects.

## Install

```sh
$ npm install --save-dev babel-preset-playlyfe
```
>
Note if 'babelRuntime'(see options below) is enabled then install 'babel-runtime' also.
```sh
  $ npm install --save babel-runtime
>

## Usage

## .babelrc

```json
{
  "presets": ["playlyfe"]
}
```

## Options

* `ie10` - bool (default true) Add support for ie10.
* `react` - bool (default true) Enable react support.
* `reactIntl` - bool (default true) Enable react-intl support.
* `babelRuntime` - bool (default true) Enable [babel-plugin-transform-runtime plugin](https://babeljs.io/docs/plugins/transform-runtime).
* `flow` - bool (default true) Enable flow support.

```
// disable ie10 support
{
  presets: [
    ["playlyfe", {"ie10": false}]
  ]
}

// disable react
{
  presets: [
    ["playlyfe", {"react": false}]
  ]
}

// disable babelRuntime
{
  presets: [
    ["playlyfe", {"babelRuntime": false}]
  ]
}

// disable flow support
{
  presets: [
    ["playlyfe", {"flow": false}]
  ]
}
```

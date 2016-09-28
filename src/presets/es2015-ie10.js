/* @flow */
import modify from 'modify-babel-preset';

const LOOSE = { loose: true };
const ADD = true;
// const REMOVE = false;

// enable loose for ie10 support
module.exports = modify('babel-preset-es2015', {
  'transform-es2015-classes': LOOSE, // ie10 fix
  'transform-proto-to-assign': ADD, // ie10 fix
});

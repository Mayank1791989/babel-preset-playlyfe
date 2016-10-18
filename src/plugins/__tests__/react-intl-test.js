import { transformFileSync } from 'babel-core';
import path from 'path';

const fixtureFile = path.join(__dirname, './data', 'component.js');

describe('check intl messages in transformed file metadata', () => {
  const transform = transformFileSync(fixtureFile, {
    babelrc: false,
    presets: [
      require('babel-preset-es2015'),
      require('babel-preset-stage-0'),
      require('babel-preset-react'),
    ],
    plugins: [require('../react-intl').default],
  });
  it('exports 6 intl messages', () => {
    expect(transform.metadata['react-intl'].messages.length).toEqual(6);
  });
});

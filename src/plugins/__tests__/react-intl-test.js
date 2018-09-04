/* @flow */
import { transformFileSync, transform } from 'babel-core';
import path from 'path';

const fixtureFile = path.join(__dirname, './data', 'component.js');

describe('check intl messages in transformed file metadata', () => {
  const { metadata } = transformFileSync(fixtureFile, {
    babelrc: false,
    presets: [require('babel-preset-env')],
    plugins: [
      require('babel-plugin-transform-object-rest-spread'),
      require('babel-plugin-syntax-jsx'),
      require('babel-plugin-transform-react-jsx'),
      require('../react-intl').default,
    ],
  });
  it('exports 6 intl messages', () => {
    expect(metadata['react-intl'].messages).toMatchSnapshot();
  });
});

test('correctly throw invalid intl message error', () => {
  expect(() => {
    transform(`
      import React from 'react';
      import { FormattedMessage } from 'react-intl';

      const Component = (
        <FormattedMessage
          id="test.xyz"
          defaultMessage="{xyz, select, y {test}"
        />
      );
    `, {
      babelrc: false,
      presets: [require('babel-preset-env')],
      plugins: [
        require('babel-plugin-transform-object-rest-spread'),
        require('babel-plugin-syntax-jsx'),
        require('babel-plugin-transform-react-jsx'),
        require('../react-intl').default,
      ],
    });
  }).toThrowErrorMatchingSnapshot();
});

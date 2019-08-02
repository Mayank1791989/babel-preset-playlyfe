/* @flow */
import { testParseCode, transform } from './test-utils';
import stripAnsi from 'strip-ansi';

testParseCode('react jsx', {
  opts: [undefined, { react: true }],
  throws: false,
  code: `
    class Component extends React.Component {
      render() {
        return (
          <div>
            <span>Test</span>
          </div>
        );
      }
    }
  `,
});

testParseCode('react jsx', {
  opts: [{ react: false }],
  throws: true,
  code: `
    class Component extends React.Component {
      render() {
        return (
          <div>
            <span>Test</span>
          </div>
        );
      }
    }
  `,
});

test('should not include react source and self by default', () => {
  const code = `
    const test = () => {
      return <div />;
    }
  `;

  const transformed = transform(code, { react: true });

  expect(transformed.code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    var test = function test() {
      return React.createElement(\\"div\\", null);
    };"
  `);
});

test('include react source and self if development mode is on', () => {
  const code = `
    const test = () => {
      return <div />;
    }
  `;

  const transformed = transform(code, { react: true, development: true });

  expect(transformed.code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    var _jsxFileName = \\"/test-file.js\\";

    var test = function test() {
      return React.createElement(\\"div\\", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 3
        },
        __self: this
      });
    };"
  `);
});

describe('support react-intl', () => {
  const code = `
    import { FormattedMessage } from 'react-intl';

    const component = () => {
      <div>
        <FormattedMessage id="some_id" defaultMessage="Some message" />
      </div>
    };
  `;

  it('should provide react-intl info in metadata', () => {
    const result = transform(code);
    expect(result.metadata['react-intl']).toBeDefined();
  });

  it('should not include react-intl in metadata if disabled', () => {
    const result = transform(code, { reactIntl: false });
    expect(result.metadata['react-intl']).not.toBeDefined();
  });

  describe('should able to extract messages', () => {
    it('<FormattedMessage />', () => {
      const result = transform(code);
      expect(result.metadata['react-intl']).toEqual({
        messages: [
          {
            id: 'some_id',
            description: undefined,
            defaultMessage: 'Some message',
          },
        ],
      });
    });

    test('intl.formatMessage', () => {
      const result = transform(`
        const component = () => {
          return (
            <div>
              {this.props.intl.formatMessage({
                id: "some_id",
                defaultMessage: "Some message",
              })}
            </div>
          );
        }
      `);
      expect(result.metadata['react-intl']).toEqual({
        messages: [
          {
            id: 'some_id',
            description: undefined,
            defaultMessage: 'Some message',
          },
        ],
      });
    });
  });

  test('correctly throw invalid intl message error', () => {
    expect(() => {
      try {
        transform(`
          import React from 'react';
          import { FormattedMessage } from 'react-intl';

          const Component = (
            <FormattedMessage
              id="test.xyz"
              defaultMessage="{xyz, select, y {test}"
            />
          );
        `);
      } catch (err) {
        throw new Error(stripAnsi(err.message));
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

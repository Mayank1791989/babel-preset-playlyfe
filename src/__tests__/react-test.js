/* @flow */
import { testParseCode, transform } from './test-utils';

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
});

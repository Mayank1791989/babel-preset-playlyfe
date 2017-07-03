/* @flow */
import { testParseCode, transform } from './test-utils';

testParseCode('react jsx', {
  opts: [null, undefined, { react: true }],
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

test('include react source and self for dev', () => {
  const code = `
    const test = () => {
      return <div />;
    }
  `;
  const transformed = transform(code, { react: true });
  expect(transformed.code).toMatchSnapshot();
});

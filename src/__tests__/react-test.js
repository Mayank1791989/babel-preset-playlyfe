/* @flow */
import { testParseCode } from './test-utils';

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

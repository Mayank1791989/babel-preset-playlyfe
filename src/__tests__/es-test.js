/* @flow */
import { testParseCode, testExecCode } from './test-utils';

const opts = [null, undefined, { ie10: true }, { ie10: false }];

testParseCode('Allow trailing function commas', {
  opts,
  throws: false,
  code: `
    function Test(
      arg1,
      arg2,
      arg3,
    ) {
      console.log('arg1')
    }
  `,
});

testParseCode('Allow class properties', {
  opts,
  throws: false,
  code: `
    class Test {
      static x = 5;
      y = 10;
    }
  `,
});

testParseCode('Allow Object rest spread', {
  opts,
  throws: false,
  code: `
    const a = {
      name: 'babel',
    };
    const b = {
      core: 'core',
    };
    const c = {
      ...a,
      ...b,
    };
  `,
});

testParseCode('Allow exports of form export name from module', {
  opts,
  throws: false,
  code: `
    export test from 'test-module';
  `,
});

testParseCode('Allow exports of form export * as name from module', {
  opts,
  throws: false,
  code: `
    export * as test from 'test-module';
  `,
});

testParseCode('Allow decorator', {
  opts,
  throws: false,
  code: `
    @generateStyles(() => ({}))
    class Test extends React.Component {
      render() {
        return null;
      }
    }
  `,
});

testParseCode('Default Flow Support is enabled', {
  opts,
  throws: false,
  code: `
    function test(test1: string, test2: number) {}
  `,
});

testParseCode('Can disable flow support', {
  opts: [{ flow: false }],
  throws: true,
  code: `
    function test(test1: string, test2: number) {}
  `,
});

// supports async await
testParseCode('Async await syntax support', {
  opts: [{ asyncAwait: true }],
  throws: false,
  code: `
    async function test() {
      const a = await test2();
    }
  `,
});

testExecCode('async await should work', {
  opts: [{ asyncAwait: true }],
  code: `
    const response = "test-request-response";

    function testRequest() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(response);
        }, 10);
      });
    }

    async function test() {
      const _response = await testRequest();
      expect(_response).toEqual(response);
    }

    // for async test
    returnValue(test());
  `,
});

testExecCode('decorators should work with static properties', {
  opts,
  code: `
    function someDecorator(Component) {
      return class WrappedComponent {
        render() {
          <Component {...this.props} />
        }
      }
    }

    @someDecorator
    class Test {
      static propTypes = {
        a: 10,
      };
    }

    // Tests
    // NOTE here 'Test' is 'someDecorator(Test)' not class Test
    expect(Test.propTypes).toBeUndefined();
  `,
});

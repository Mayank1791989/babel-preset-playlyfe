/* @flow */
import { testParseCode, testExecCode, transform } from './test-utils';

const opts = [null, undefined];

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

testParseCode('Allow exports of form export { name } from module', {
  opts,
  throws: false,
  code: `
    export { test } from 'test-module';
  `,
});
testParseCode('Dont allow exports of form export name from module', {
  opts,
  throws: false,
  code: `
    export { test } from 'test-module';
  `,
});
testParseCode('Allow exports of form export * as name from module', {
  opts,
  throws: true,
  code: `
    export * as test from 'test-module';
  `,
});

testParseCode('Allow decorators only if enabled', {
  opts: [{ decorators: true }],
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
testParseCode('By default dont allow decorators', {
  opts: [null],
  throws: true,
  code: `
    @generateStyles(() => ({}))
    class Test extends React.Component {
      render() {
        return null;
      }
    }
  `,
});
testExecCode('decorators should work with static properties (some bug)', {
  opts: [{ decorators: true }],
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

testParseCode('Default Flow Support is enabled', {
  opts,
  throws: false,
  code: `
    function test(test1: string, test2: number) {}
  `,
});
testParseCode('Flow Support can be disabled using flow option', {
  opts: [{ flow: false }],
  throws: true,
  code: `
    function test(test1: string, test2: number) {}
  `,
});

test('flow should strip whole import if it contains only types', () => {
  const transformed = transform(`
    import { type A, type B } from 'some-package';
    function test() {
      console.log('test');
    }
  `);

  expect(transformed.code).toMatchSnapshot();
});

testParseCode('Support import shorthand', {
  opts,
  throws: false,
  code: `
    import { type A, B, typeof C } from 'test';
  `,
});

testParseCode('Support dynamic import if enabled', {
  opts: [{ dynamicImport: true }],
  throws: false,
  code: `
    function someDynamicImport() {
      import('xyz').then(() => console.log('dynamic import'));
    }
  `,
});
testParseCode('By default dont support dynamic import', {
  opts: [null],
  throws: true,
  code: `
    function someDynamicImport() {
      import('xyz').then(() => console.log('dynamic import'));
    }
  `,
});

test('Support disable import conversion', () => {
  const code = `
    import { test } from 'test';
    console.log('test');
  `;
  const transformed = transform(code, { modules: false });
  expect(transformed.code).toMatchSnapshot();
});

// supports async await
test('default dont transform transform async await', () => {
  const transformed = transform(`
    async function test() {
      const a = await test2();
    }
  `);

  expect(transformed.code).toMatchSnapshot();
});

test('transform if Async await enabled', () => {
  const transformed = transform(
    `
    async function test() {
      const a = await test2();
    }
  `,
    { asyncAwait: true },
  );

  expect(transformed.code).toMatchSnapshot();
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

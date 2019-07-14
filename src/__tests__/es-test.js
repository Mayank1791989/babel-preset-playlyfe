/* @flow */
import { testParseCode, testExecCode, transform } from './test-utils';

const opts = [undefined];

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

test('Transform class properties', () => {
  const { code } = transform(
    `
    class Test {
      static x = 5;
      y = 10;
    }
  `,
    { modules: false },
  );
  expect(code).toMatchInlineSnapshot(`
    "import _classCallCheck from \\"@babel/runtime/helpers/esm/classCallCheck\\";

    var Test = function Test() {
      _classCallCheck(this, Test);

      this.y = 10;
    };

    Test.x = 5;"
  `);
});

test('Use commonjs by default for modules', () => {
  const { code } = transform(
    `
    class Test {
      static x = 5;
      y = 10;
    }
  `,
  );
  expect(code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    var _interopRequireDefault = require(\\"@babel/runtime/helpers/interopRequireDefault\\");

    var _classCallCheck2 = _interopRequireDefault(require(\\"@babel/runtime/helpers/classCallCheck\\"));

    var Test = function Test() {
      (0, _classCallCheck2[\\"default\\"])(this, Test);
      this.y = 10;
    };

    Test.x = 5;"
  `);
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

test('correctly transform object-rest-spread', () => {
  const { code } = transform(`
    const a = { name: 'babel' };
    const b = { core: 'core' };
    const c = { ...a, ...b };
  `);
  expect(code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    var a = {
      name: 'babel'
    };
    var b = {
      core: 'core'
    };
    var c = Object.assign({}, a, {}, b);"
  `);
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

test('[Bug] flow should strip whole import if it contains only types', () => {
  const transformed = transform(`
    import { type A, type B } from 'some-package';
    function test() {
      console.log('test');
    }
  `);

  expect(transformed.code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    function test() {
      console.log('test');
    }"
  `);
});

testParseCode('Support import shorthand', {
  opts,
  throws: false,
  code: `
    import { type A, B, typeof C } from 'test';
  `,
});

describe('Dynamic Imports', () => {
  testParseCode('Parsing', {
    opts: [undefined, { modules: false }],
    throws: false,
    code: `
      function someDynamicImport() {
        import('xyz').then(() => console.log('dynamic import'));
      }
    `,
  });

  describe('Transform dynamic import', () => {
    const code = `
      function someDynamicImport() {
        import('xyz').then(() => console.log('dynamic import'));
      }
    `;

    test('Skip transformation if modules: false (for webpack)', () => {
      const transformed = transform(code, { modules: false });
      expect(transformed.code).toMatchInlineSnapshot(`
        "function someDynamicImport() {
          import('xyz').then(function () {
            return console.log('dynamic import');
          });
        }"
      `);
    });

    test('transform if modules enabled', () => {
      const transformed = transform(code, { modules: 'commonjs' });

      expect(transformed.code).toMatchInlineSnapshot(`
        "\\"use strict\\";

        var _interopRequireDefault = require(\\"@babel/runtime/helpers/interopRequireDefault\\");

        var _interopRequireWildcard2 = _interopRequireDefault(require(\\"@babel/runtime/helpers/interopRequireWildcard\\"));

        function someDynamicImport() {
          Promise.resolve().then(function () {
            return (0, _interopRequireWildcard2[\\"default\\"])(require('xyz'));
          }).then(function () {
            return console.log('dynamic import');
          });
        }"
      `);
    });
  });
});

test('Support disable import conversion', () => {
  const code = `
    import { test } from 'test';
    console.log('test');
  `;
  const transformed = transform(code, { modules: false });
  expect(transformed.code).toMatchInlineSnapshot(`
    "import { test } from 'test';
    console.log('test');"
  `);
});

// supports async await
test('default dont transform transform async await', () => {
  const transformed = transform(`
    async function test() {
      const a = await test2();
    }
  `);

  expect(transformed.code).toMatchInlineSnapshot(`
    "\\"use strict\\";

    async function test() {
      var a = await test2();
    }"
  `);
});

test('transform if Async await enabled', () => {
  const transformed = transform(
    `
    async function test() {
      const a = await test2();
    }
  `,
    { asyncAwait: true, modules: false },
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

test('Correctly replace core-js with individual import for target', () => {
  const { code } = transform(
    `
    import 'core-js/stable';
  `,
    { modules: false },
  );

  expect(code).toMatchSnapshot();
});

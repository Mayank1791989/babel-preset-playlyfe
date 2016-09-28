/* @flow */
import * as babel from 'babel-core';

type Opts = null | typeof undefined | Object;

export function transform(code: string, opts: Opts) {
  return babel.transform(code, {
    presets: [[require('../index'), opts]], // eslint-disable-line global-require
  });
}

export function testParseCode(
  title: string,
  testConfig: $Exact<{
    opts: Array<Opts>,
    code: string,
    throws: bool,
  }>
) {
  testConfig.opts.forEach((opts) => {
    const runTransform = () => {
      transform(testConfig.code, opts);
    };
    describe(title, () => {
      it(`with opts = ${JSON.stringify(opts)}`, () => {
        if (testConfig.throws) {
          expect(runTransform).toThrow();
        } else {
          expect(runTransform).not.toThrow();
        }
      });
    });
  });
}

export function testExecCode(
  title: string,
  testConfig: $Exact<{
    opts: Array<Opts>,
    code: string,
  }>
) {
  testConfig.opts.forEach((opts) => {
    describe(title, () => {
      it(`with opts = ${JSON.stringify(opts)}`, () => {
        // NOTE: here disabling babel runtime
        const transformed = transform(testConfig.code, {
          ...(opts || {}),
          // NOTE: disabling runtime as we will exec code in sandboxed environment
          // we cant use require|imports only sandbox variables present
          babelRuntime: false,
        });

        const sandbox: {[key: string]: any} = { expect };
        const fn = new Function( // eslint-disable-line no-new-func
          // $FlowIssue: valid code but flow throwing error
          ...Object.keys(sandbox),
          transformed.code,
        );
        fn(...Object.values(sandbox));
      });
    });
  });
}


/* @flow */
import * as babel from '@babel/core';
import preset, { type Opts as PresetOpts } from '../index';

type Opts = $Shape<PresetOpts>;

export function transform(code: string, presetOpts: ?Opts) {
  return babel.transform(code, {
    presets: [[preset, presetOpts]], // eslint-disable-line global-require
    // required for transformation
    filename: '/test-file.js',
    // required to avoid using global setting
    babelrc: false,
  });
}

export function testParseCode(
  title: string,
  testConfig: {|
    opts: Array<?Opts>,
    code: string,
    throws: boolean,
  |},
) {
  testConfig.opts.forEach(opts => {
    const runTransform = () => {
      transform(testConfig.code, opts);
    };
    describe(title, () => {
      it(`with opts = ${JSON.stringify(opts || null)}`, () => {
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
  testConfig: {|
    opts: Array<?Opts>,
    code: string,
  |},
) {
  testConfig.opts.forEach(opts => {
    describe(title, () => {
      it(`with opts = ${JSON.stringify(opts || null)}`, () => {
        // NOTE: here disabling babel runtime
        const transformed = transform(testConfig.code, {
          ...opts,
          babelRuntime: true,
        });

        // eslint-disable-next-line
        let fnCallReturnValue = undefined;
        const sandbox = {
          expect,
          returnValue(value) {
            fnCallReturnValue = value;
          },
          require,
        };
        const fn = new Function( // eslint-disable-line no-new-func
          // $FlowIssue: valid code but flow throwing error
          ...Object.keys(sandbox),
          transformed.code,
        );
        fn(...Object.values(sandbox));

        // Note: some hack to receive value from function
        // note only test-utils know this is called as function not actual test
        // so we can't directly return from test code.
        return fnCallReturnValue;
      });
    });
  });
}

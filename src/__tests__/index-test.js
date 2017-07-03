/* @flow */
import preset from '../index';

describe('preset-options', () => {
  it('works without options', () => {
    expect(() => {
      preset();
    }).not.toThrow();
  });

  it('dont throw when options are correct', () => {
    expect(() => {
      preset(null, { react: true });
    }).not.toThrow();
  });

  it('throws when unknown options passed', () => {
    expect(() => {
      // $FlowDisable - testing this error
      preset(null, { xyz: true });
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws when wrong value passed for option', () => {
    expect(() => {
      // $FlowDisable - testing this error
      preset(null, { react: 'xyz' });
    }).toThrowErrorMatchingSnapshot();
  });
});

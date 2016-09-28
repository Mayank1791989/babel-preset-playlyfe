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
      preset(null, { react: true, ie10: false });
    }).not.toThrow();
  });

  it('throws when unknown options passed', () => {
    expect(() => {
      // $FlowDisable - testing this error
      preset(null, { xyz: true });
    }).toThrow();
  });

  it('throws when wrong value passed for option', () => {
    expect(() => {
      // $FlowDisable - testing this error
      preset(null, { react: 'xyz' });
    }).toThrow();
  });
});

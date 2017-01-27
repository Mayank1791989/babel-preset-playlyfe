/* @flow */
import { transform } from './test-utils';

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

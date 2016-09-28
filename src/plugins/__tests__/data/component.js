/* eslint-disable */
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  externalDefineMessage: { id: 'externaslDefineMessage', defaultMessage: 'External Define Messasssge' },
});
const nonMessages = {};

const Component = (
  <div>
    {/* These use different messages, so 5 messages should be exported */}
    <FormattedMessage id="inlineComponent" defaultMessage="Inline Text 1" />
    <FormattedHTMLMessage id="inlineHTMLComponent" defaultMessage="Inline Text 1" />
    <div title={this.context.intl.formatMessage(defineMessages({ inlineDefineMessage: { id: 'inlineDefineMessage', defaultMessage: 'Inline DefineMessage' } }))} />
    <div title={this.context.intl.formatMessage({ id: 'inlineFormatMessage', defaultMessage: 'Inline Format Message' })} />
    <div title={this.context.intl.formatHTMLMessage({ id: 'inlineFormatHTMLMessage', defaultMessage: 'Inline Format HTML Message' })} />

    {/* These use the same message, so only 1 message should be exported */}
    <div title={this.context.intl.formatMessage(messages.externalDefineMessage)} />
    <div title={this.context.intl.formatMessage({ ...messages.externalDefineMessage, description: 'abc' })} />
    <FormattedMessage {...messages.externalDefineMessage} values={{ value: 1 }} />

    {/* each of these should not result in a intl message */}
    <FormattedMessage {...nonMessages.badMessage1} />
    <div title={this.context.intl.formatMessage(nonMessages.badMessage1)} />
    <input placeholder={this.context.intl.formatMessage(nonMessages.badMessage2, { value: 1 })} />
  </div>
);

export default Component;

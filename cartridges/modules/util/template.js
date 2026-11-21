'use strict';

module.exports = {
    /**
     * @description Creates html data attributes with values
     * @param {object} dataObject Object with attributes
     * @returns {string} data attribute with value
     */
    renderDataAttributes: function (dataObject) {
        var URL = require('dw/web/URL');
        var StringUtils = require('dw/util/StringUtils');
        var SecureEncoder = require('dw/util/SecureEncoder');

        return Object.keys(dataObject || {}).map(function (key) {
            var dataAttributeName = StringUtils.format('data-{0}', key.split(/(?=[A-Z])/).join('-').toLowerCase());
            var dataAttributeValue = '';

            if (dataObject[key] instanceof URL) {
                dataAttributeValue = dataObject[key].toString();
            } else if (typeof dataObject[key] === 'object' && dataObject[key]) {
                dataAttributeValue = JSON.stringify(dataObject[key]);
            } else {
                dataAttributeValue = dataObject[key];
            }

            return StringUtils.format('{0} = "{1}"', dataAttributeName, SecureEncoder.forHtmlInDoubleQuoteAttribute(dataAttributeValue));
        }).join('\n');
    },
    /**
     * @description Streams data attributes to response
     * @param {object} dataObject Object with attributes
     */
    streamDataAttributes: function (dataObject) {
        var URL = require('dw/web/URL');
        var StringUtils = require('dw/util/StringUtils');
        var SecureEncoder = require('dw/util/SecureEncoder');

        var encoder = SecureEncoder.forHtmlInDoubleQuoteAttribute;
        var responseWriter = response.getWriter();

        Object.keys(dataObject || {}).forEach(function (key) {
            var dataAttributeName = StringUtils.format('data-{0}', key.split(/(?=[A-Z])/).join('-').toLowerCase());
            var dataAttributeValue = dataObject[key];

            if (dataAttributeValue instanceof URL) {
                responseWriter.print(
                    encoder(dataAttributeName + '=' + dataAttributeValue.toString() + ' ')
                );
            } else if (typeof dataAttributeValue === 'object' && dataAttributeValue) {
                responseWriter.print(dataAttributeName + '="');

                require('util/json').streamStringifyForAttribute(dataAttributeValue);

                responseWriter.print('" ');
            } else {
                responseWriter.print(encoder(dataAttributeName + '=' + dataAttributeValue + ' '));
            }
        });
    }
};

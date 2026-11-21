'use strict';

const jsonHelpers = {

    /**
     * @description General wrapper for JSON.parse(...) with error catching
     * @param {string} stringified The string object representation to parse
     * @param {string | object} defaultObject The default object
     * @returns {object} Parsed object
     */
    parse: function (stringified, defaultObject) {
        var parsed = {};

        if (!stringified) {
            return defaultObject;
        }

        try {
            parsed = JSON.parse(stringified);
        } catch (e) {
            const logger = require('dw/system/Logger');

            logger.error('Error while parsing {0} string: {1}\n{2}', stringified, e.message, e.stack);

            return defaultObject;
        }

        return parsed;
    },

    /**
     * @description JSON.stringify method that print directly to response.writer stringified JSON object
     * property by property. In such way it works like stream rendering of JSON.
     * @param {object} obj - object to stringify
     * @param {(string) => string} [encoder] - encoder function that can encode string before printing it to response
     * @returns {string} empty string
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    streamStringify: function (obj, encoder) {
        const responseWriter = response.getWriter();

        encoder = encoder || function (value) {
            return value;
        };

        if (Array.isArray(obj)) {
            responseWriter.print('[');

            for (let index = 0, count = obj.length; index < count; index++) {
                responseWriter.print(encoder(JSON.stringify(obj[index]) + (index === count - 1 ? '' : ',')));
            }

            responseWriter.print(']');
        } else if (obj && typeof obj === 'object') {
            var keys = Object.keys(obj);
            var needPrintComma = false;

            responseWriter.print('{');

            for (var i = 0, length = keys.length; i < length; i++) {
                var key = keys[i];
                var value = obj[key];
                var type = typeof value;

                if (type === 'undefined' || type === 'function') {
                    continue;
                }

                if (needPrintComma) {
                    responseWriter.print(',');
                } else {
                    needPrintComma = true;
                }

                responseWriter.print(encoder('"' + key + '":'));

                if (Array.isArray(value)) {
                    jsonHelpers.streamStringify(value, encoder);
                } else {
                    responseWriter.print(encoder(JSON.stringify(value)));
                }
            }

            responseWriter.print('}');
        } else {
            responseWriter.print(encoder(JSON.stringify(obj)));
        }

        return '';
    },
    /**
     * @description JSON.stringify method that print directly to response.writer stringified JSON object
     * property by property. It apply encoder SecureEncoder.forHtmlInDoubleQuoteAttribute that allows to use
     * this method for rendering big JSON into data attributes
     *
     * @example
     * ```
     * <div
     *    data-items="${require('util/json').streamStringifyForAttribute(pdict.items)}"
     * ></div>
     * ```
     *
     * @param {object} obj - object to stringify
     * @returns {string} empty string
     */
    streamStringifyForAttribute: function (obj) {
        var SecureEncoder = require('dw/util/SecureEncoder');

        return jsonHelpers.streamStringify(obj, SecureEncoder.forHtmlInDoubleQuoteAttribute);
    }
};

module.exports = jsonHelpers;

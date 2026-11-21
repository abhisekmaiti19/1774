'use strict';

/**
 * _preferences.properties helper module
 *
 * @module pref
 */
var Resource = require('dw/web/Resource');

/**
 * Custom mapping for preferences that are not stored in the resource bundle.
 * defineProperty used to not load the value until it is requested.
 */
var mapping = {};

Object.defineProperty(mapping, 'recaptcha.enabled', {
    get: function() {
        const captchaServiceProvider = require('*/cartridge/scripts/util/ProviderMgr').getCaptchaServiceProvider();

        return captchaServiceProvider
            && captchaServiceProvider.isEnabled()
            && captchaServiceProvider.getServiceProviderName() === 'GoogleReCAPTCHA';
    }
});

Object.defineProperty(mapping, 'friendlyCaptcha.enabled', {
    get: function() {
        const captchaServiceProvider = require('*/cartridge/scripts/util/ProviderMgr').getCaptchaServiceProvider();

        return captchaServiceProvider
            && captchaServiceProvider.isEnabled()
            && captchaServiceProvider.getServiceProviderName() === 'FriendlyCaptcha';
    }
});

module.exports = {
    /**
     * @description get preference from resource bundle defined in _preference.properties file
     * @param {string} key Key from properties file
     * @param {string} [defaultValue] Default value will be returned if there is no such key
     * @returns {string} Preference value
     */
    get: function (key, defaultValue) {
        return Resource.msg(key, '_preferences', (typeof defaultValue !== 'undefined') ? defaultValue : '');
    },

    /**
     * @description Get formatted preference from resource bundle defined in _preference.properties file
     * @param {string} key Key from properties file
     * @param {string} defaultValue Default value will be returned if there is no such key
     * @param {object} args Arguments to format, can be single value or an Array
     * @returns {string} Formatted string value of preference
     */
    getf: function (key, defaultValue, args) {
        return Resource.msgf(key, '_preferences', (typeof defaultValue !== 'undefined') ? defaultValue : '', args);
    },

    /**
     * @description Checking boolean preference from resource bundle defined in _preference.properties file
     * Checks custom mapping first, then checks the resource bundle.
     * @param {string} key Key from properties file
     * @param {string} bundle Resource bundle
     * @returns {boolean} Returns true if value of resource bundle is boolean true
     */
    is: function (key, bundle) {
        if (key in mapping) {
            return !!mapping[key];
        }

        return Resource.msg(key, bundle || '_preferences', '') === 'true';
    },

    /**
     * @description Checking if value exists and not empty in resource bundle  defined in _preference.properties file
     * @param {string} key Key from properties file
     * @param {string} bundle Resource bundle
     * @returns {boolean} Returns true if value of resource bundle doesn't exists or empty
     */
    isEmpty: function (key, bundle) {
        // eslint-disable-next-line no-undef
        return empty(Resource.msg(key, bundle || '_preferences', ''));
    },

    /**
     * @description Helper method to return thenValue if key in _preferences.properties is set to true and elseValue otherwise
     * @param {*} key from _preferences.properties bundle
     * @param {*} thenValue - value returned if key has 'true' value
     * @param {*} elseValue - value returned if key not defined or 'false'
     * @returns {*} thenValue or elseValue
     */
    if: function (key, thenValue, elseValue) {
        var condition = Resource.msg(key, '_preferences', '') === 'true';

        return condition ? thenValue : elseValue;
    }
};

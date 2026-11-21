'use strict';

/**
 * @param {any} obj - object
 * @returns {string} result
 */
function getType(obj) {
    return Object.prototype.toString.call(obj).match(/([a-z]+)(:?\])/i)[1].toLowerCase();
}

/**
 * @param {*} type - any type to check
 * @returns {Function} result
 */
function typeWrapper(type) {
    return function (obj) {
        return getType(obj) === type;
    };
}

/**
 * @param {bigint | dw.util.BigInteger | string | number} value - value that should be converted
 * @returns {number} result
 */
function toNumber(value) {
    if (typeof value === 'number') {
        return value;
    }

    // Deprecated, legacy version of bigint
    var BigInteger = require('dw/util/BigInteger');

    if (value instanceof BigInteger) {
        return value.get();
    }

    return Number(value);
}

module.exports = {
    getType: getType,
    isNull: typeWrapper('null'),
    isUndefined: typeWrapper('undefined'),
    isString: typeWrapper('string'),
    isNumber: typeWrapper('number'),
    isBoolean: typeWrapper('boolean'),
    isObject: typeWrapper('object'),
    isArray: Array.isArray,
    toNumber: toNumber
};

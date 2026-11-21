'use strict';

var type = require('./type');

/**
 * @description Object.assign polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 *
 * @param {object} target - target object
 * @returns {object} result
 */
function assign(target) {
    if (type.isNull(target) || type.isUndefined(target)) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (type.isNull(nextSource) || type.isUndefined(nextSource)) {
            continue;
        }

        // eslint-disable-next-line no-restricted-syntax
        for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }

    return to;
}

/**
 * @param {object} target - target object
 * @returns {object} result
 */
function deepAssign(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    return sources.reduce(function (accumulator, nextSource) {
        Object.keys(nextSource).forEach(function (sourceKey) {
            var currentValue = accumulator[sourceKey];
            var nextValue = nextSource[sourceKey];

            if (Array.isArray(nextValue)) {
                accumulator[sourceKey] = (currentValue || []).concat(nextValue);
            } else if (type.isObject(nextValue)) {
                accumulator[sourceKey] = deepAssign(currentValue || {}, nextValue);
            } else {
                accumulator[sourceKey] = nextValue;
            }
        });

        return accumulator;
    }, target);
}

/**
 * @description Polyfill for Object.keys
 *
 * @param {object} obj - object
 * @returns {object} result
 */
function keys(obj) {
    return Object.keys(obj);
}

/**
 * @description Polyfill for Object.values
 *
 * @param {object} obj - object to get values from
 * @returns {Array<any>} result
 */
function values(obj) {
    return Object.keys(obj).map(function (key) {
        return obj[key];
    });
}

/**
 * @description Polyfill for Object.entries
 *
 * @param {object} obj - object from get entries
 * @returns {object} result
 */
function entries(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i);

    while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
}

/**
 * @param {object} obj - object to convert to hash map
 * @returns {dw.util.HashMap} result
 */
function toHashMap(obj) {
    var HashMap = require('dw/util/HashMap');
    var result = new HashMap();

    Object.keys(obj).forEach(function (key) {
        result.put(key, obj[key]);
    });

    return result;
}

/**
 * @description Converts hashMap to object
 * @param {dw.util.HashMap} obj - entry hash map
 * @returns {object} result
 */
function fromHashMap(obj) {
    var result = {};
    var entryIterator = obj.entrySet().iterator();

    while (entryIterator.hasNext()) {
        var entry = entryIterator.next();
        var key = entry[0];
        var value = entry[1];

        result[key] = value;
    }

    return result;
}

/**
 * @description Access given properties of an object recursively
 *
 * @param {object} obj The object
 * @param {string} path The property string, i.e. 'data.myValue.prop1'
 * @returns {object} The value of the given property or undefined
 */
function get(obj, path) {
    var propPath = (path || '').split('.');
    var result = obj;

    if (!result || (result && (typeof result !== 'object'))) {
        return undefined;
    }

    try {
        propPath.forEach(function (prop) {
            if (result && prop in result) { // if result is primitive, operator `in` throws exception
                result = result[prop];
            } else {
                result = undefined;
            }
        });
    } catch (error) {
        var Logger = require('dw/system/Logger');

        Logger.error('Failed to parse object properties by path: {0}. Error: {1} \n {2}', path, error.message, error.stack);

        result = undefined;
    }

    return result;
}

/**
 * @description Sets the value at path of object.
 * If a portion of path doesn't exist, it's created.
 *
 * @param {object} obj - object to set value
 * @param {string} path - path for the value
 * @param {any} value - value to set
 * @returns {object} result
 */
function set(obj, path, value) {
    var propPath = (path || '').split('.');
    var nested = obj;
    var lastIndex = propPath.length - 1;

    propPath.forEach(function (prop, i) {
        if (!nested[prop]) {
            nested[prop] = {};
        }

        if (i !== lastIndex) {
            nested = nested[prop];
        } else {
            nested[prop] = value;
        }
    });

    return obj;
}

/**
 * @template T
 * @param {Record<string, T>} target objects container
 * @param {keyof T} functionName function that should be called
 */
function callEachNestedObjectWithFunction(target, functionName) {
    Object.keys(target).forEach((key) => {
        var nestedObject = target[key];

        if (typeof nestedObject[functionName] === 'function') {
            nestedObject[functionName]();
        }
    });
}

module.exports = {
    assign: assign,
    deepAssign: deepAssign,
    keys: keys,
    values: values,
    entries: entries,
    toHashMap: toHashMap,
    fromHashMap: fromHashMap,
    get: get,
    set: set,
    callEachNestedObjectWithFunction: callEachNestedObjectWithFunction
};

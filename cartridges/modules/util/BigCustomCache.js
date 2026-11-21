'use strict';

var PART_SIZE_LIMIT = 40000;

/**
 * @category util
 * @subcategory modules
 * @class BigCustomCache
 * @classdesc Wrapper around dw.system.Cache instance that allow to save big data into custom cache.
 *
 * In SFCC documentation mentioned that in Custom Cache can be stored up to 128 kb per one entry
 * In reality when save objects bigger than 50 kb it not store them with error that it is too big.
 * To workaround this limitation was implemented this module. For details how it work read description of each methods.
 *
 * @param {string} cacheID - cache id to initialize dw.system.Cache instance
 */
function BigCustomCache(cacheID) {
    var CacheMgr = require('dw/system/CacheMgr');

    this.cacheInstance = CacheMgr.getCache(cacheID);
}

/**
 * Put big value into cache
 *
 * Logic for putting big value into cache are next:
 * 1. JSON.stringify object that should be stored
 * 2. Create hash for stringified value to ensure that later will be collected correct parts
 * 3. Split stringified value to parts (40000 bytes each)
 * 4. Store object with first part into cache. This object has next properties that will be used for getting other parts:
 *   - hash - hash of stringified value
 *   - count - total count of parts
 *   - part - value of first part
 * 5. Store other parts with key `hash + i` (where `i` is index of part).
 *    Using hash as key help to ensure that part is correct and no need to generate hash once more
 *
 * @param {string} key - key for storing value
 * @param {object|string} value - value to store
 */
BigCustomCache.prototype.put = function (key, value) {
    if (typeof value === 'undefined') {
        return;
    }

    var stringifiedValue = JSON.stringify(value);
    var hash = this.getHash(stringifiedValue);

    var valueLength = stringifiedValue.length;
    var parts = [];
    var index = 0;

    while (index < valueLength) {
        var part = stringifiedValue.slice(index, index + PART_SIZE_LIMIT);

        parts.push(part);

        index += part.length;
    }

    for (var i = 0; i < parts.length; i++) {
        if (i === 0) {
            this.cacheInstance.put(key, {
                hash: hash,
                count: parts.length,
                part: parts[i]
            });
        } else {
            this.cacheInstance.put(hash + i, parts[i]);
        }
    }
};

/**
 * Get big object from cache and return it value
 *
 * Big object split by parts. Logic of combining parts are next:
 * 1. Get object with first part that is stored with `key`. This object contain definition of parts (see method `put` for details)
 * 2. If object is not have required fields or undefined then return it as is.
 * 3. Get `hash` and `count` from object
 * 4. Based on `hash` and `count` get other parts using key `hash + i` (where `i` is index of part)
 * 5. If some part is missing in cache then it was expired and we not able to return entire result. So return undefined or `loader` function value
 * 6. Concat all parts and execute JSON.parse on it
 *
 * @param {string} key - key for getting value from cache
 * @param {Function} [loader] - loader function that will return value and store it into cache in case when object not exist in cache
 * @returns {object|string|undefined} - cached value or undefined if not found in cache
 */
BigCustomCache.prototype.get = function (key, loader) {
    var definitionObject = this.cacheInstance.get(key);
    var result;

    if (typeof definitionObject === 'undefined') {
        if (typeof loader === 'function') {
            result = loader();
            this.put(key, result);
        }

        return result;
    } else if (!(definitionObject && definitionObject.hash && definitionObject.count)) {
        // Something go wrong and object received from cache
        // not match expected object, most probably it was overridden
        // by direct call to Cache.put()
        return definitionObject;
    }

    result = definitionObject.part;
    var hash = definitionObject.hash;

    for (var i = 1; i < definitionObject.count; i++) {
        var part = this.cacheInstance.get(hash + i);

        if (typeof part === 'undefined') {
            // part of value expired in cache and we not able to
            // collect all parts together
            result = undefined;
            break;
        }

        result += part;
    }

    if (result) {
        var jsonUtil = require('./json');

        return jsonUtil.parse(result);
    } else if (typeof result === 'undefined' && typeof loader === 'function') {
        result = loader();
        this.put(key, result);
    }

    return result;
};

/**
 * Invalidate cache parts for passed `key`
 *
 * @param {string} key - key to invalidate
 */
BigCustomCache.prototype.invalidate = function (key) {
    var definitionObject = this.cacheInstance.get(key);

    if (definitionObject && definitionObject.hash && definitionObject.count) {
        for (var i = 1; i < definitionObject.count; i++) {
            this.cacheInstance.invalidate(definitionObject.hash + i);
        }
    }

    this.cacheInstance.invalidate(key);
};

/**
 * Get MD5 hash for passed `value`
 *
 * @param {string} value - value to perform hashing
 * @returns {string} hash
 */
BigCustomCache.prototype.getHash = function (value) {
    var Encoding = require('dw/crypto/Encoding');
    var Bytes = require('dw/util/Bytes');
    var WeakMessageDigest = require('dw/crypto/WeakMessageDigest');
    var messageDigest = new WeakMessageDigest(WeakMessageDigest.DIGEST_MD5);

    var digested = messageDigest.digestBytes(
        new Bytes(value)
    );

    return Encoding.toHex(digested);
};

module.exports = BigCustomCache;

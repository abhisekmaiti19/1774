/* eslint-disable curly */

/**
 * @category util
 * @subcategory mustache
 * @module mustache-sfcc
 * @description Wrapper for Mustache rendering library with next modification:
 * - Allows to render directly into response.writer. This allows to render big mustache templates without problems.
 * - Added caching of parsed template object
 */

'use strict';

var baseMustache = require('./mustache');
var responseWriter = response.getWriter();

var BaseWriter = baseMustache.Writer;
var baseRenderTokens = BaseWriter.prototype.renderTokens;

/**
 * A SFCC Writer extend default Writer form Mustache library.
 * It knows how to take a stream of tokens and render them to response.writer using method print(),
 * given a context. It also maintains a cache of templates to
 * avoid the need to parse the same template twice.
 */
function SFCCWriter() {
    this.templateCache = {
        keyCache: {},
        /**
         * Calculate MD5 digest for passed value in order to get cache key
         *
         * @param {string} value - key value to be digested
         * @returns {string} digested value
         */
        getKey: function (value) {
            if (this.keyCache[value]) {
                return this.keyCache[value];
            }

            var Encoding = require('dw/crypto/Encoding');
            var Bytes = require('dw/util/Bytes');
            var WeakMessageDigest = require('dw/crypto/WeakMessageDigest');
            var messageDigest = new WeakMessageDigest(WeakMessageDigest.DIGEST_MD5);

            var digested = messageDigest.digestBytes(
                new Bytes(value)
            );

            this.keyCache[value] = Encoding.toHex(digested);

            return this.keyCache[value];
        },
        /**
         * Save into cache value with passed key
         *
         * @param {string} key - key for caching
         * @param {object} value - parsed template object
         */
        set: function (key, value) {
            var md5Key = this.getKey(key);

            this.cacheInstance.put(md5Key, value);
        },
        /**
         * Get cached parsed template object from cache
         *
         * @param {string} key - key for cached value
         * @returns {object} cached parsed template  object
         */
        get: function (key) {
            var md5Key = this.getKey(key);

            var value = this.cacheInstance.get(md5Key);

            return value;
        },
        /**
         * Clear cache. Empty function because CacheMgr not support clean of cache
         */
        clear: function () {}
    };

    Object.defineProperty(this.templateCache, 'cacheInstance', {
        enumerable: true,
        get: () => {
            if (!this.cacheInstance) {
                var CustomCache = require('./BigCustomCache');

                this.cacheInstance = new CustomCache('mustache');
            }

            return this.cacheInstance;
        },
        set: (cacheInstance) => {
            this.cacheInstance = cacheInstance;
        }
    });
}

SFCCWriter.prototype = Object.create(BaseWriter.prototype);

/**
 * Low-level method that renders into response.writer the given array of `tokens` using
 * the given `context` and `partials`.
 *
 * @param {Array} tokens - tokens for rendering
 * @param {object} context - template context
 * @param {object} partials - template partials
 * @param {string} originalTemplate - original template
 * @param {Array} tags - tags
 * @returns {string} resulting string. We put all data directly to response.writer,
 * so from this method always returned empty string.
 */
SFCCWriter.prototype.renderTokens = function renderTokens(tokens, context, partials, originalTemplate, tags) {
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
        responseWriter.print(
            baseRenderTokens.call(this, [tokens[i]], context, partials, originalTemplate, tags)
        );
    }

    return '';
};

var sfccWriter = new SFCCWriter();

var sfccMustache = {
    name: 'mustache.js',
    version: '4.0.1',
    tags: ['{{', '}}'],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    set templateCache(cache) {
        sfccWriter.templateCache = cache;
    },
    get templateCache() {
        return sfccWriter.templateCache;
    }
};

/**
 * Clear writer cache.
 * Comparing to original Mustache just replaced writer to sfccWriter.
 *
 * @returns {void}
 */
sfccMustache.clearCache = function clearCache() {
    return sfccWriter.clearCache();
};

/**
 * Parse template and generate tokens for rendering.
 * Comparing to original Mustache just replaced writer to sfccWriter.
 *
 * @param {string} template - template for rendering
 * @param {object} tags - custom tags for parsing
 * @returns {object} parsed tokens
 */
sfccMustache.parse = function parse(template, tags) {
    return sfccWriter.parse(template, tags);
};

/**
 * Parse template and generate tokens for rendering.
 * Comparing to original Mustache just replaced writer to sfccWriter.
 *
 * @param {object} template - parsed template for rendering
 * @param {object} view - object with view data for rendering
 * @param {string} partials - partials for rendering
 * @param {object} tags - custom tags for parsing
 * @returns {string} rendered string. We put all data directly to response.writer,
 * so from this method always returned empty string.
 */
sfccMustache.render = function render(template, view, partials, tags) {
    if (typeof template !== 'string') {
        throw new TypeError('Invalid template! Template should be a "string"');
    }

    return sfccWriter.render(template, view, partials, tags);
};

sfccMustache.escape = baseMustache.escape;
sfccMustache.Scanner = baseMustache.Scanner;
sfccMustache.Context = baseMustache.Context;
sfccMustache.Writer = SFCCWriter;

/**
 * Helper method to rendering inline mustache template, by passing path to ISML template where defined Mustache template
 * and view data object.
 *
 * @param {string} pathToMustacheIsmlTemplate - path to ISML template inside which defined mustache template
 * @param {object} viewData - object with view data for rendering
 * @returns {string} rendered string. We put all data directly to response.writer,
 * so from this method always returned empty string.
 */
sfccMustache.renderInline = function (pathToMustacheIsmlTemplate, viewData) {
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

    var mustacheTemplate = renderTemplateHelper.getRenderedHtml(viewData, pathToMustacheIsmlTemplate);

    return sfccMustache.render(mustacheTemplate, viewData);
};

module.exports = sfccMustache;

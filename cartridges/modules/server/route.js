'use strict';

var EventEmitter = require('./EventEmitter');

/**
 * @param {Object} req - Request object
 * @returns {Object} object containing the querystring of the loaded page
 */
function getPageMetadata(req) {
    var pageMetadata = {};
    var action = req.path.split('/');

    /*
     * req.path is in format /on/demandware.store/Sites-site-id-Site/en_GB/Search-Show
     * But when configured domain only home page URL on production
     * it became without last two parts /on/demandware.store/Sites-site-id-Site
     * As a result logic not correctly detect action name
     * This hack with checking of magic number "6"(amount of parts in correct req.path)
     * used to fix this issue
     */
    if (action.length < 6) {
        pageMetadata.action = 'Home-Show';
    } else {
        pageMetadata.action = action[action.length - 1];
    }

    var SecureEncoder = require('dw/util/SecureEncoder');
    pageMetadata.action = SecureEncoder.forHtmlContent(pageMetadata.action || '');
    pageMetadata.queryString = SecureEncoder.forHtmlContent(req.querystring.toString() || '');
    pageMetadata.locale = req.locale.id;
    pageMetadata.originalRequestURL = getOriginalRequestURL(req.querystring, pageMetadata.action);

    return pageMetadata;
}

/**
 * Retrieves original URL without parameters added by service worker
 * @param {object} querystring - query string object
 * @param {string} pageMetadataAction - string with endpoint's name
 * @returns {dw.web.URL} url without sw_skipheader and sw_skipfooter
 */
function getOriginalRequestURL(querystring, pageMetadataAction) {
    var URLUtils = require('dw/web/URLUtils');

    var originalUrl = URLUtils.url(pageMetadataAction);

    Object.keys(querystring).forEach(paramName => {
        if (paramName.indexOf('sw_') === 0) {
            return;
        }

        originalUrl.append(paramName, querystring[paramName]);
    });

    return originalUrl.abs();
}

/**
 * @constructor
 * @param {string} name - Name of the route, corresponds to the second part of the URL
 * @param {Function[]} chain - List of functions to be executed
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
function Route(name, chain, req, res) {
    this.name = name;
    this.chain = chain;
    this.req = req;
    this.res = res;
    res.setViewData(getPageMetadata(req));
    EventEmitter.call(this);
}

Route.prototype = EventEmitter.prototype;
/**
 * Go to the next step in the chain or complete the chain after the last step
 * @param {Object} error - Error object from the previous step
 * @returns {void}
 */
Route.prototype.next = function(error) {
    if (error) {
        // process error here and output error template
        this.res.log(error);
        throw new Error(error.message, error.fileName, error.lineNumber);
    }

    if (this.res.redirectUrl) {
        // if there's a pending redirect, break the chain
        this.emit('route:Redirect', this.req, this.res);
        if (this.res.redirectStatus) {
            this.res.base.redirect(this.res.redirectUrl, this.res.redirectStatus);
        } else {
            this.res.base.redirect(this.res.redirectUrl);
        }
        return;
    }

    if (this.currentChainIndex < this.chain.length) {
        this.runNextChain = true;
    } else {
        this.done.call(this, this.req, this.res);
    }
};
/**
 * Create a single function that chains all of the calls together, one after another
 * @returns {Function} Function to be executed when URL is hit
 */
Route.prototype.getRoute = function () {
    var me = this;
    this.runNextChain = false;
    this.currentChainIndex = 0;
    return (function (err) {
        if (err && err.ErrorText) {
            var system = require('dw/system/System');
            var showError = system.getInstanceType() !== system.PRODUCTION_SYSTEM;

            me.req.error.errorText = showError ? err.ErrorText : '',
            me.req.error.controllerName = showError ? err.ControllerName : '',
            me.req.error.startNodeName = showError ? err.CurrentStartNodeName || me.name : ''
        }

        // freeze request object to avoid mutations
        Object.freeze(me.req);

        me.emit('route:Start', me.req, me.res);
        me.chain[me.currentChainIndex++].call(me, me.req, me.res, me.next.bind(me));

        while (me.runNextChain) {
            me.runNextChain = false;
            me.emit('route:Step', me.req, me.res);
            me.chain[me.currentChainIndex++].call(me, me.req, me.res, me.next.bind(me));
        }

    });
};

/**
 * Append a middleware step into current chain
 *
 * @param {Function} step - New middleware step
 * @return {void}
 */
Route.prototype.append = function append(step) {
    this.chain.push(step);
};

/**
 * Last step in the chain, this will render a template or output a json string
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {void}
 */
Route.prototype.done = function done(req, res) {
    this.emit('route:BeforeComplete', req, res);
    this.emit('route:Complete', req, res);
};

module.exports = Route;

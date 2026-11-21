const URL = require('./URL');

const URLUtils = {
    CONTEXT_CATALOG: 'ContextCatalog',
    CONTEXT_LIBRARY: 'ContextLibrary',
    CONTEXT_SITE: 'ContextSite',
    http: function (id) {
        return id;
    },
    https: function (url, ...params) {
        return URLUtils.url(url, ...params).toString();
    },
    imageURL: function (context, contextId = '', path) {
        if (!contextId && !path) {
            path = context;
            context = URLUtils.CONTEXT_LIBRARY;
            contextId = '';
        }

        const urlPath = context + contextId + path;

        return URLUtils.url(urlPath);
    },
    staticURL: function (context, contextId = '', path) {
        if (!contextId && !path) {
            path = context;
            context = URLUtils.CONTEXT_SITE;
            contextId = '';
        }

        const urlPath = context + contextId + path;

        return URLUtils.url(urlPath);
    },
    absStatic: function (...params) {
        return URLUtils.staticURL(...params).abs();
    },
    home: function () {
        return URLUtils.url('homeUrl');
    },
    abs: function (action, ...params) {
        const url = URLUtils.url(action, ...params);

        return url.abs();
    },
    url: function (action, ...params) {
        const urlParams = {};

        for (let i = 0, l = params.length; i < l; i += 2) {
            const firstParam = params[i];
            const secondParam = params[i + 1];

            if (typeof firstParam === 'object' && firstParam) {
                urlParams[firstParam.aName] = firstParam.aValue;

                if (typeof secondParam === 'object' && secondParam) {
                    urlParams[secondParam.aName] = secondParam.aValue;
                }
            } else if (secondParam !== undefined) {
                urlParams[firstParam] = secondParam;
            }
        }

        return new URL(action, urlParams);
    },
    httpsImage: function (context, contextId = '', relPath) {
        if (!contextId && !relPath) {
            relPath = context;
            context = URLUtils.CONTEXT_LIBRARY;
            contextId = '';
        }

        const urlPath = context + contextId + relPath;

        return URLUtils.url(urlPath);
    }
};

module.exports = URLUtils;

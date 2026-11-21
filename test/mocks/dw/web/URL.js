const QueryString = require('../../modules/server/queryString');

function URL(action, params = {}) {
    this.protocol = 'http://';
    this.currentHost = 'test.com';
    this.rel = true;
    this.action = action;
    this.params = params;
}

URL.prototype.abs = function () {
    this.rel = false;

    return this;
};

URL.prototype.append = function (name, value) {
    this.params[name] = value;

    return this;
};

URL.prototype.appendCSRFTokenBM = function () {
};

URL.prototype.host = function (host) {
    this.currentHost = host;

    return this;
};

URL.prototype.http = function () {
    this.protocol = 'http://';
};

URL.prototype.https = function () {
    this.protocol = 'https://';
};

URL.prototype.relative = function () {
    this.rel = true;

    return this;
};

URL.prototype.remove = function (name) {
    delete this.params[name];
};

URL.prototype.siteHost = function () {
    this.currentHost = 'sitehost.com';
};

URL.prototype.toString = function () {
    let result = '';

    if (!this.rel) {
        result += this.protocol;
        result += this.currentHost;
        result += '/';
    }

    result += this.action;

    if (this.params && Object.keys(this.params).length) {
        const querystring = QueryString.prototype.toString.call(this.params);

        result += '?' + querystring;
    }

    return result.length && result[result.length - 1] === '&'
        ? result.substring(0, result.length - 1)
        : result;
};

module.exports = URL;

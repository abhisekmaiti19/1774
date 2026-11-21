const Cookie = function (name, value) {
    this.name = name;
    this.value = value;
};

Cookie.prototype.setMaxAge = function (seconds) {
    this.maxAge = seconds;
};

Cookie.prototype.setPath = function (path) {
    this.path = path;
};

module.exports = Cookie;

function StringWriter() {
    this.buff = '';
}

StringWriter.prototype.write = function (str, off, len) {
    if (typeof off !== 'undefined' && typeof off !== 'undefined') {
        this.buff += str.substring(off, len + off);
    } else {
        this.buff += str;
    }
};

StringWriter.prototype.toString = function () {
    return this.buff;
};

StringWriter.prototype.flush = function () {
// just ensure that everything written into me
};

StringWriter.prototype.close = function () {
    this.buff = '';
};

module.exports = StringWriter;

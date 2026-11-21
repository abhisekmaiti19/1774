const Iterator = require('./Iterator');

function SeekableIterator(elements) {
    Iterator.call(this, elements);
    this.count = this.elements.length;
}

SeekableIterator.prototype = Object.create(Iterator.prototype, {});
SeekableIterator.prototype.constructor = Iterator;

SeekableIterator.prototype.first = function () {
    return this.elements[0];
};

SeekableIterator.prototype.close = function () {};

SeekableIterator.prototype.getCount = function () {
    return this.elements.length;
};

module.exports = SeekableIterator;

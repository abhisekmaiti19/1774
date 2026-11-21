const List = require('./List');

function Iterator(elements) {
    this.elements = elements;
    this.position = -1;
}

Iterator.prototype.hasNext = function () {
    return (this.position + 1 < this.elements.length);
};

Iterator.prototype.next = function () {
    if (this.hasNext()) {
        return this.elements[++this.position];
    }

    return null;
};

Iterator.prototype.reset = function () {
    this.position = -1;
};

Iterator.prototype.asList = function () {
    return new List(...this.elements);
};

Iterator.prototype.close = function () {};

module.exports = Iterator;

class ES6Iterator {
    constructor(iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    next() {
        if (this.index < this.iterable.length) {
            return { value: this.iterable[this.index++], done: false };
        }

        return { done: true };
    }

    [Symbol.iterator]() {
        return this;
    }
}

module.exports = ES6Iterator;

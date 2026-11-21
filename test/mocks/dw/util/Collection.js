'use strict';

const util = require('util');

function Collection(...values) {
    let items = [];
    const self = this;

    if (values.length === 1 && Array.isArray(values[0])) {
        items = [...values[0]];
    } else {
        items = values;
    }

    this.defineIndexProperties(items);

    this.add = function (item) {
        items.push(item);
        this.length++;
        this.defineIndexProperties(items);
    };

    this.iterator = function () {
        let i = 0;

        return {
            hasNext: function () {
                return i < items.length;
            },
            next: function () {
                return items[i++];
            },
            asList: function () {
                return self;
            }
        };
    };

    this.getLength = function () {
        return items.length;
    };

    this.size = function () {
        return items.length;
    };

    this.length = this.getLength();

    this.toArray = function () {
        return items;
    };

    this.addAll = function (collection) {
        items = items.concat(collection.toArray());
        this.length = items.length;
        this.defineIndexProperties(items);
    };

    this.contains = function (item) {
        return items.indexOf(item) >= 0;
    };

    this.reduce = function () {
        const args = Array.from(arguments);
        let total = args[1];
        const callback = args[0];

        items.forEach(item => {
            total = callback(total, item);
        });

        return total;
    };

    this.filter = function () {
        const args = Array.from(arguments);
        const result = [];
        const callback = args[0];

        items.forEach(item => {
            if (callback(item)) {
                result.push(item);
            }
        });

        return result;
    };

    this.map = function () {
        const args = Array.from(arguments);
        let list = args[0];
        const callback = args[1];

        if (list && Object.prototype.hasOwnProperty.call(list, 'toArray')) {
            list = list.toArray();
        }

        return list ? list.map(callback) : [];
    };

    this.get = function (index) {
        return items[index];
    };

    this.isEmpty = function () {
        return !this.getLength();
    };

    this.remove = function (item) {
        const indexToRemove = items.indexOf(item);

        if (indexToRemove !== -1) {
            this.length--;
        }

        items.splice(indexToRemove, 1);
    };

    this.removeAll = function () {
        items = [];
        this.length = 0;

        return true;
    };

    this.sort = function (sortFn) {
        this.removeIndexProperties(items);
        items = items.sort(sortFn);
        this.defineIndexProperties(items);
    };

    this.indexOf = function (element) {
        return items.indexOf(element);
    };
}

Collection.prototype.removeIndexProperties = function (items) {
    items.forEach((item, index) => {
        if (Object.prototype.hasOwnProperty.call(this, index)) {
            delete this[index];
        }
    });
};

Collection.prototype.defineIndexProperties = function (items) {
    items.forEach((item, index) => {
        if (!Object.prototype.hasOwnProperty.call(this, index)) {
            Object.defineProperty(this, index, {
                configurable: true,
                get: () => items[index],
                set: value => { items[index] = value; }
            });
            this[index] = item;
        }
    });
};

// Added for debug purposes
Collection.prototype[util.inspect.custom] = function () {
    const array = this.toArray();

    return `Collection (${array.length}) ${util.inspect(array)}`;
};

module.exports = Collection;

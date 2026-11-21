'use strict';

const SeekableIterator = require('#mocks/dw/util/SeekableIterator');

class CustomObjectMgr {
    static remove() {}

    static queryCustomObject() {
        return null;
    }

    static queryCustomObjects() {
        return new SeekableIterator([]);
    }

    static createCustomObject() {
        return {};
    }

    static getCustomObject() {
        return null;
    }

    static getAllCustomObjects() {
        return new SeekableIterator([]);
    }
}

module.exports = CustomObjectMgr;

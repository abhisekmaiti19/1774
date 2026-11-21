/* eslint-disable no-underscore-dangle */

const util = require('util');

const Set = require('./Set');

class Map {
    /**
     * @private
     * @description This field do not exist in dw.util.Map
     */
    _result = new global.Map();

    put(key, value) {
        this._result.set(key, value);
    }

    putAll() {
    }

    get(key) {
        return this._result.get(key);
    }

    keySet() {
        const keys = this._result.keys();

        return new Set([...keys]);
    }

    entrySet() {
        const entries = this._result.entries();

        return new Set([...entries]);
    }

    values() {
        const entries = this._result.values();

        return new Set([...entries]);
    }

    size() {
        return this._result.size;
    }

    remove(key) {
        this._result.delete(key);
    }

    clear() {
        this._result.clear();
    }

    containsKey(key) {
        return this._result.has(key);
    }
}

// Added for debug purposes
Map.prototype[util.inspect.custom] = function () {
    return util.inspect(this._result);
};

module.exports = Map;

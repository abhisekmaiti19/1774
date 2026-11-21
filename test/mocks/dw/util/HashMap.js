/* eslint-disable no-underscore-dangle */

const util = require('util');

const Map = require('./Map');

class HashMap extends Map {
    containsKey = function (item) {
        return !!this._result.has(item);
    };
}

// Added for debug purposes
HashMap.prototype[util.inspect.custom] = function () {
    return util.inspect(this._result).replace('Map', 'HashMap');
};

module.exports = HashMap;

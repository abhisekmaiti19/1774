const sinon = require('sinon');

let storage = {};

const getFn = function (cacheVarName, callback) {
    if (storage[cacheVarName]) {
        return storage[cacheVarName];
    }

    switch (cacheVarName) {
        default:
            if (typeof callback === 'function') {
                storage[cacheVarName] = callback();

                return storage[cacheVarName];
            }

            return undefined;
    }
};

const putFn = function (cacheVarName, value) {
    storage[cacheVarName] = value;
};

const invalidateFn = function (cacheVarName) {
    delete storage[cacheVarName];
};

const cache = {
    get: sinon.spy(getFn),
    put: sinon.spy(putFn),
    invalidate: sinon.spy(invalidateFn)
};

module.exports = {
    getCache: function () {
        return cache;
    },
    clearStorage() {
        storage = {};
        this.getCache().get.resetHistory();
        this.getCache().put.resetHistory();
        this.getCache().invalidate.resetHistory();
    }
};

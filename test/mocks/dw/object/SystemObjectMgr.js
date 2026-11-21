const ObjectAttributeDefinition = require('./ObjectAttributeDefinition');
const SeekableIterator = require('../util/SeekableIterator');
const storesMock = require('../catalog/StoreMgr').getStore();

class SystemObjectMgr {
    static describe() {
        return new ObjectAttributeDefinition();
    }

    static querySystemObjects() {
        return new SeekableIterator([storesMock]);
    }
}

module.exports = SystemObjectMgr;

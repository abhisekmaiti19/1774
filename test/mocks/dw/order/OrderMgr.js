const SeekableIterator = require('../util/SeekableIterator');
const Status = require('../system/Status');

function OrderMgr() {

}

OrderMgr.searchOrders = function () {
    return new SeekableIterator([]);
};

OrderMgr.searchOrder = function () {

};

OrderMgr.getOrder = function () {

};

OrderMgr.failOrder = function () {
    return {
        order: 'failed order stub'
    };
};

OrderMgr.createOrder = function () {
    return {
        order: 'new order stub'
    };
};

OrderMgr.createOrderNo = function () {
    return '00000101';
};

OrderMgr.placeOrder = function () {
    return Status.OK;
};

OrderMgr.processOrders = function () {
    // This is a mock function that should be stubbed in tests
};

OrderMgr.queryOrders = function () {
    return new SeekableIterator([]);
};

module.exports = OrderMgr;

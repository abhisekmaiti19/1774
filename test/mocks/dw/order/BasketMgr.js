const BasketData = require('../../testDataMgr/instances/dw/order/Basket');

function getCurrentBasket() {
    return BasketData.createCurrentBasket();
}

function getStoredBasket() {
    return BasketData.createCurrentBasket();
}

function getTemporaryBasket() {
    return BasketData.createCurrentBasket();
}

function getCurrentOrNewBasket() {
    return BasketData.createPaymentBasket();
}

module.exports.getCurrentBasket = getCurrentBasket;
module.exports.getStoredBasket = getStoredBasket;
module.exports.getCurrentOrNewBasket = getCurrentOrNewBasket;
module.exports.getTemporaryBasket = getTemporaryBasket;

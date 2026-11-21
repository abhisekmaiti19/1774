const { createInitialOrderAddress } = require('../../testDataMgr/instances/dw/order/OrderAddress');
const Collection = require('#mocks/dw/util/Collection');

class Shipment {
    static SHIPPING_STATUS_NOTSHIPPED = 0;

    static SHIPPING_STATUS_SHIPPED = 2;

    createShippingAddress() {
        const address = createInitialOrderAddress();

        this.shippingAddress = address;

        return address;
    }

    getShippingAddress() {
        return this.shippingAddress;
    }

    getShippingMethodID() {
        return this.shippingMethod?.ID;
    }

    setShippingMethod(method) {
        this.shippingMethod = method;
    }

    getShippingMethod() {
        return this.shippingMethod
    }

    getShippingPriceAdjustments() {
        return new Collection([]);
    }

    getShippingLineItems() {
        return new Collection([]);
    }

    getShippingTotalPrice() {
        return this.shippingTotalPrice;
    }

    getCustom = function () {
        return this.custom;
    };
}

module.exports = Shipment;

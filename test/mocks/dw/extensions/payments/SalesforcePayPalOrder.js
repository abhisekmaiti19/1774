const OrderPaymentInstrument = require('../../order/OrderPaymentInstrument');
const Money = require('../../value/Money');
const SalesforcePayPalOrderPayer = require('./SalesforcePayPalOrderPayer');
const SalesforcePayPalOrderAddress = require('./SalesforcePayPalOrderAddress');

class SalesforcePayPalOrder {
    get amount() {
        return this.getAmount();
    }

    get captureID() {
        return this.getCaptureID();
    }

    get completed() {
        return this.isCompleted();
    }

    get ID() {
        return this.getID();
    }

    get payer() {
        return this.getPayer();
    }

    get shipping() {
        return this.getShipping();
    }

    getAmount() {
        return new Money(0);
    }

    getCaptureID() {
        return 'captureID';
    }

    getID() {
        return 'ID';
    }

    getPayer() {
        return new SalesforcePayPalOrderPayer();
    }

    getPaymentInstrument() {
        return new OrderPaymentInstrument();
    }

    getShipping() {
        return new SalesforcePayPalOrderAddress();
    }

    isCompleted() {
        return false;
    }
}

module.exports = SalesforcePayPalOrder;

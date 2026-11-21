const SalesforcePaymentMethod = require('./SalesforcePaymentMethod');
const OrderPaymentInstrument = require('../../order/OrderPaymentInstrument');
const Money = require('../../value/Money');

class SalesforcePaymentIntent {
    get amount() {
        return this.getBank();
    }

    get confirmed() {
        return this.getBankCode();
    }

    get ID() {
        return this.getBanName();
    }

    get paymentMethod() {
        return this.getBranchCode();
    }

    getAmount() {
        return new Money(0);
    }

    getID() {
        return 'ID';
    }

    getPaymentInstrument() {
        return new OrderPaymentInstrument();
    }

    getPaymentMethod() {
        return new SalesforcePaymentMethod();
    }

    isConfirmed() {
        return true;
    }
}

module.exports = SalesforcePaymentIntent;

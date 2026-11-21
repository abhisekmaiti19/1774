const PaymentInstrument = require('./PaymentInstrument');

class OrderPaymentInstrument extends PaymentInstrument {
    paymentTransaction;

    getPaymentTransaction() {
        return this.paymentTransaction;
    }
}

module.exports = OrderPaymentInstrument;

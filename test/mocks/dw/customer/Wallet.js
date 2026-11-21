const dw = require('../index');

class Wallet {
    paymentInstruments = new dw.util.Collection();

    createPaymentInstrument(paymentMethodId) {
        const paymentInstrument = new dw.customer.CustomerPaymentInstrument();

        paymentInstrument.paymentMethod = paymentMethodId;

        this.paymentInstruments.add(paymentInstrument);

        return paymentInstrument;
    }

    getPaymentInstruments(paymentMethodID) {
        if (paymentMethodID) {
            const result = this.paymentInstruments
                .toArray()
                .filter(pi => pi.paymentMethod === paymentMethodID);

            return new dw.util.Collection(result);
        } else {
            return this.paymentInstruments;
        }
    }
}

module.exports = Wallet;

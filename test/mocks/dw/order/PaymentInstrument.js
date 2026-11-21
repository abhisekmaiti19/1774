class PaymentInstrument {
    static ENCRYPTION_ALGORITHM_RSA = 'RSA';

    static METHOD_BANK_TRANSFER = 'BANK_TRANSFER';

    static METHOD_BML = 'BML';

    static METHOD_CREDIT_CARD = 'CREDIT_CARD';

    static METHOD_DW_ANDROID_PAY = 'DW_ANDROID_PAY';

    static METHOD_DW_APPLE_PAY = 'DW_APPLE_PAY';

    static METHOD_GIFT_CERTIFICATE = 'GIFT_CERTIFICATE';

    custom = {};

    paymentMethod;

    setCreditCardToken(value) {
        this.creditCardToken = value;
    }

    setCreditCardHolder(value) {
        this.creditCardHolder = value;
    }

    setCreditCardNumber(value) {
        this.creditCardNumber = value;
    }

    setCreditCardType(value) {
        this.creditCardType = value;
    }

    setCreditCardExpirationMonth(value) {
        this.creditCardExpirationMonth = value;
    }

    setCreditCardExpirationYear(value) {
        this.creditCardExpirationYear = value;
    }

    getCreditCardToken() {
        return this.creditCardToken;
    }

    getPaymentMethod() {
        return this.paymentMethod;
    }

    getCreditCardNumber() {
        return this.creditCardNumber;
    }
}

module.exports = PaymentInstrument;

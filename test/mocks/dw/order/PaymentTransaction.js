class PaymentTransaction {
    static TYPE_AUTH = 'AUTH';

    static TYPE_AUTH_REVERSAL = 'AUTH_REVERSAL';

    static TYPE_CAPTURE = 'CAPTURE';

    static TYPE_CREDIT = 'CREDIT';

    amount;

    paymentInstrument;

    paymentProcessor;

    transactionID;

    type;

    setTransactionID(ID) {
        this.transactionID = ID;
    }

    getTransactionID() {
        return this.transactionID;
    }

    getAmount() {
        return this.amount;
    }
}

module.exports = PaymentTransaction;

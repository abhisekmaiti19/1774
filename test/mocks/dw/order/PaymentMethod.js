class PaymentMethod {
    ID;

    name;

    getName() {
        return this.name;
    }

    getID() {
        return this.ID;
    }

    getPaymentProcessor() {
        return this.paymentProcessor;
    }

    getApplicablePaymentCards() {
        return this.applicablePaymentCards;
    }

    getActivePaymentCards() {
        return this.activePaymentCards;
    }
}

module.exports = PaymentMethod;

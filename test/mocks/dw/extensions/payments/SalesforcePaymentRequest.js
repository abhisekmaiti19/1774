const Set = require('../../util/Set');

class SalesforcePaymentRequest {
    constructor(id, selector) {
        this.ID = id;
        this.selector = selector;

        this.ELEMENT_CARD_CVC = SalesforcePaymentRequest.ELEMENT_CARD_CVC;
        this.ELEMENT_CARD_EXPIRY = SalesforcePaymentRequest.ELEMENT_CARD_EXPIRY;
        this.ELEMENT_CARD_NUMBER = SalesforcePaymentRequest.ELEMENT_CARD_NUMBER;
        this.ELEMENT_IBAN = SalesforcePaymentRequest.ELEMENT_IBAN;
        this.ELEMENT_IDEAL_BANK = SalesforcePaymentRequest.ELEMENT_IDEAL_BANK;
        this.ELEMENT_PAYMENT_REQUEST_BUTTON = SalesforcePaymentRequest.ELEMENT_PAYMENT_REQUEST_BUTTON;
        this.ELEMENT_TYPE_APPLEPAY = SalesforcePaymentRequest.ELEMENT_TYPE_APPLEPAY;
        this.ELEMENT_TYPE_BANCONTACT = SalesforcePaymentRequest.ELEMENT_TYPE_BANCONTACT;
        this.ELEMENT_TYPE_CARD = SalesforcePaymentRequest.ELEMENT_TYPE_CARD;
        this.ELEMENT_TYPE_IDEAL = SalesforcePaymentRequest.ELEMENT_TYPE_IDEAL;
        this.ELEMENT_TYPE_PAYMENTREQUEST = SalesforcePaymentRequest.ELEMENT_TYPE_PAYMENTREQUEST;
        this.ELEMENT_TYPE_PAYPAL = SalesforcePaymentRequest.ELEMENT_TYPE_PAYPAL;
        this.ELEMENT_TYPE_PAYPAL_EXPRESS = SalesforcePaymentRequest.ELEMENT_TYPE_PAYPAL_EXPRESS;
        this.ELEMENT_TYPE_SEPA_DEBIT = SalesforcePaymentRequest.ELEMENT_TYPE_SEPA_DEBIT;
        this.PAYPAL_SHIPPING_PREFERENCE_GET_FROM_FILE = SalesforcePaymentRequest.PAYPAL_SHIPPING_PREFERENCE_GET_FROM_FILE;
        this.PAYPAL_SHIPPING_PREFERENCE_NO_SHIPPING = SalesforcePaymentRequest.PAYPAL_SHIPPING_PREFERENCE_NO_SHIPPING;
        this.PAYPAL_SHIPPING_PREFERENCE_SET_PROVIDED_ADDRESS = SalesforcePaymentRequest.PAYPAL_SHIPPING_PREFERENCE_SET_PROVIDED_ADDRESS;
        this.PAYPAL_USER_ACTION_CONTINUE = SalesforcePaymentRequest.PAYPAL_USER_ACTION_CONTINUE;
        this.PAYPAL_USER_ACTION_PAY_NOW = SalesforcePaymentRequest.PAYPAL_USER_ACTION_PAY_NOW;
    }

    static ELEMENT_CARD_CVC = 'cardCvc';

    static ELEMENT_CARD_EXPIRY = 'cardExpiry';

    static ELEMENT_CARD_NUMBER = 'cardNumber';

    static ELEMENT_IBAN = 'iban';

    static ELEMENT_IDEAL_BANK = 'idealBank';

    static ELEMENT_PAYMENT_REQUEST_BUTTON = 'paymentRequestButton';

    static ELEMENT_TYPE_APPLEPAY = 'applepay';

    static ELEMENT_TYPE_BANCONTACT = 'bancontact';

    static ELEMENT_TYPE_CARD = 'card';

    static ELEMENT_TYPE_IDEAL = 'ideal';

    static ELEMENT_TYPE_PAYMENTREQUEST = 'paymentrequest';

    static ELEMENT_TYPE_PAYPAL = 'paypal';

    static ELEMENT_TYPE_PAYPAL_EXPRESS = 'paypalexpress';

    static ELEMENT_TYPE_SEPA_DEBIT = 'sepa_debit';

    static PAYPAL_SHIPPING_PREFERENCE_GET_FROM_FILE = 'GET_FROM_FILE';

    static PAYPAL_SHIPPING_PREFERENCE_NO_SHIPPING = 'NO_SHIPPING';

    static PAYPAL_SHIPPING_PREFERENCE_SET_PROVIDED_ADDRESS = 'SET_PROVIDED_ADDRESS';

    static PAYPAL_USER_ACTION_CONTINUE = 'CONTINUE';

    static PAYPAL_USER_ACTION_PAY_NOW = 'PAY_NOW';

    get basketData() {
        return this.getBasketData();
    }

    get billingDetails() {
        return this.getBillingDetails();
    }

    get exclude() {
        return this.getExclude();
    }

    get include() {
        return this.getInclude();
    }

    get setupFutureUsage() {
        return this.getSetupFutureUsage();
    }

    addExclude() {}

    addInclude() {}

    static calculatePaymentRequestOptions() {}

    static format() {}

    getBasketData() {
        return {};
    }

    getBillingDetails() {
        return {};
    }

    getExclude() {
        return new Set();
    }

    getID() {
        return this.ID;
    }

    getInclude() {
        return new Set();
    }

    getSelector() {
        return this.selector;
    }

    getSetupFutureUsage() {
        return false;
    }

    setBasketData() {}

    setBillingDetails() {}

    setOptions() {}

    setPayPalButtonsOptions() {}

    setPayPalShippingPreference() {}

    setPayPalUserAction() {}

    setReturnController() {}

    setSavePaymentMethodEnabled() {}

    setSetupFutureUsage() {}

    setStripeCreateElementOptions() {}

    setStripeElementsOptions() {}
}

module.exports = SalesforcePaymentRequest;

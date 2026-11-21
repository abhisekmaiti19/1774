class ApplePayHookResult {
    static REASON_BILLING_ADDRESS = 'InvalidBillingPostalAddress';

    static REASON_FAILURE = 'Failure';

    static REASON_PIN_INCORRECT = 'PINIncorrect';

    static REASON_PIN_LOCKOUT = 'PINLockout';

    static REASON_PIN_REQUIRED = 'PINRequired';

    static REASON_SHIPPING_ADDRESS = 'InvalidShippingPostalAddress';

    static REASON_SHIPPING_CONTACT = 'InvalidShippingContact';

    static STATUS_REASON_DETAIL_KEY = 'reason';

    constructor(status, redirect) {
        this.status = status;
        this.redirect = redirect;
    }

    getEventDetail() {
        return this.eventDetail;
    }

    getEventName() {
        return this.eventName;
    }

    getRedirect() {
        return this.redirect;
    }

    getStatus() {
        return this.status;
    }

    setEvent(name) {
        this.eventName = name;
    }

    setEvent(name, detail) {
        this.eventName = name;
        this.detail = detail;
    }
}

module.exports = ApplePayHookResult;

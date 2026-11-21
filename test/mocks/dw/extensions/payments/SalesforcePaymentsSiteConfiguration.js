class SalesforcePaymentsSiteConfiguration {
    get cardCaptureAutomatic() {
        return this.isCardCaptureAutomatic();
    }

    get expressCheckoutEnabled() {
        return this.isExpressCheckoutEnabled();
    }

    get multiStepCheckoutEnabled() {
        return this.isMultiStepCheckoutEnabled();
    }

    isCardCaptureAutomatic() {
        return false;
    }

    isExpressCheckoutEnabled() {
        return false;
    }

    isMultiStepCheckoutEnabled() {
        return false;
    }
}

module.exports = SalesforcePaymentsSiteConfiguration;

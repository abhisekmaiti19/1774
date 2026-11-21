const SalesforcePaymentIntent = require('./SalesforcePaymentIntent');
const SalesforcePaymentsSiteConfiguration = require('./SalesforcePaymentsSiteConfiguration');
const SalesforcePayPalOrder = require('./SalesforcePayPalOrder');
const Collection = require('../../util/Collection');

class SalesforcePaymentsMgr {
    static getPaymentIntent(basket) {
        return new SalesforcePaymentIntent(basket);
    }

    static getPaymentsSiteConfig() {
        return new SalesforcePaymentsSiteConfiguration();
    }

    static getPayPalOrder(basket) {
        return new SalesforcePayPalOrder(basket);
    }

    static getSavedPaymentMethods() {
        return new Collection();
    }

    static onCustomerRegistered() {}

    static removeSavedPaymentMethod() {}

    static savePaymentMethod() {}
}

module.exports = SalesforcePaymentsMgr;

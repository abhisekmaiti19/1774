class ShippingMethod {
    baseMethod = null;

    getBaseMethod() {
        return this.baseMethod;
    }

    getCurrencyCode() {
        return this.currencyCode;
    }

    getCustomerGroups() {
        return this.customerGroups;
    }

    getDependentMethods() {
        return this.dependentMethods;
    }

    getDescription() {
        return this.description;
    }

    getDisplayName() {
        return this.displayName;
    }

    getID() {
        return this.ID;
    }

    getTaxClassID() {
        return this.taxClassID;
    }

    isDefaultMethod() {
        return this.defaultMethod;
    }

    isOnline() {
        return this.online;
    }
}

module.exports = ShippingMethod;

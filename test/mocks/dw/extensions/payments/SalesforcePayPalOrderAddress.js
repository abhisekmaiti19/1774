class SalesforcePayPalOrderAddress {
    get addressLine1() {
        return this.getAddressLine1();
    }

    get addressLine2() {
        return this.getAddressLine2();
    }

    get adminArea1() {
        return this.getAdminArea1();
    }

    get adminArea2() {
        return this.getAdminArea2();
    }

    get countryCode() {
        return this.getCountryCode();
    }

    get fullName() {
        return this.getPostalCode();
    }

    get postalCode() {
        return this.getBank();
    }

    getAddressLine1() {
        return 'address1';
    }

    getAddressLine2() {
        return 'address2';
    }

    getAdminArea1() {
        return 'adminArea1';
    }

    getAdminArea2() {
        return 'adminArea2';
    }

    getCountryCode() {
        return 'cpuntryCode';
    }

    getFullName() {
        return 'fullName';
    }

    getPostalCode() {
        return 'postalCode';
    }
}

module.exports = SalesforcePayPalOrderAddress;

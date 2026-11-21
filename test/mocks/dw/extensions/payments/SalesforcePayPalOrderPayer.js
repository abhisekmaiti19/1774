class SalesforcePayPalOrderPayer {
    get emailAddress() {
        return this.getEmailAddress();
    }

    get givenName() {
        return this.getGivenName();
    }

    get phone() {
        return this.getPhone();
    }

    get surname() {
        return this.getSurname();
    }

    getEmailAddress() {
        return 'recipient1@domain.com';
    }

    getGivenName() {
        return 'John';
    }

    getPhone() {
        return '+18888888888';
    }

    getSurname() {
        return 'Doe';
    }
}

module.exports = SalesforcePayPalOrderPayer;

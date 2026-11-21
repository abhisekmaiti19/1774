class SalesforcePaymentMethod {
    constructor() {
        this.TYPE_CARD = 'card';
        this.TYPE_IDEAL = 'ideal';
        this.TYPE_SEPA_DEBIT = 'sepa_debit';
        this.TYPE_BANCONTACT = 'bancontact';
        this.TYPE_KLARNA = 'klarna';
        this.TYPE_EPS = 'eps';
        this.TYPE_AFTERPAY_CLEARPAY = 'afterpay_clearpay';
    }

    static TYPE_CARD = 'card';

    static TYPE_IDEAL = 'ideal';

    static TYPE_SEPA_DEBIT = 'sepa_debit';

    static TYPE_BANCONTACT = 'bancontact';

    static TYPE_EPS = 'eps';

    static TYPE_AFTERPAY_CLEARPAY = 'afterpay_clearpay';

    static TYPE_KLARNA = 'klarna';

    get bank() {
        return this.getBank();
    }

    get bankCode() {
        return this.getBankCode();
    }

    get bankName() {
        return this.getBanName();
    }

    get branchCode() {
        return this.getBranchCode();
    }

    get brand() {
        return this.getBrand();
    }

    get country() {
        return this.getCountry();
    }

    get ID() {
        return this.getID();
    }

    get last4() {
        return this.getLast4();
    }

    get paymentMethodCategory() {
        return this.getPaymentMethodCategory();
    }

    get type() {
        return this.getType();
    }

    getBank() {
        return 'bank';
    }

    getBankCode() {
        return 'bankCode';
    }

    getBankName() {
        return 'bankName';
    }

    getBranchCode() {
        return 'branchCode';
    }

    getBrand() {
        return 'visa';
    }

    getCountry() {
        return 'country';
    }

    getID() {
        return 'ID';
    }

    getLast4() {
        return '4444';
    }

    getType() {
        return 'card';
    }
}

module.exports = SalesforcePaymentMethod;

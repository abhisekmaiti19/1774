const Collection = require('../util/Collection');

class Order {
    static CONFIRMATION_STATUS_CONFIRMED = 2;

    static CONFIRMATION_STATUS_NOTCONFIRMED = 0;

    static EXPORT_STATUS_EXPORTED = 1;

    static EXPORT_STATUS_FAILED = 3;

    static EXPORT_STATUS_NOTEXPORTED = 0;

    static EXPORT_STATUS_READY = 2;

    static ORDER_STATUS_CANCELLED = 6;

    static ORDER_STATUS_COMPLETED = 5;

    static ORDER_STATUS_CREATED = 0;

    static ORDER_STATUS_FAILED = 8;

    static ORDER_STATUS_NEW = 3;

    static ORDER_STATUS_OPEN = 4;

    static ORDER_STATUS_REPLACED = 7;

    static PAYMENT_STATUS_NOTPAID = 0;

    static PAYMENT_STATUS_PAID = 2;

    static PAYMENT_STATUS_PARTPAID = 1;

    static SHIPPING_STATUS_NOTSHIPPED = 0;

    static SHIPPING_STATUS_PARTSHIPPED = 1;

    static SHIPPING_STATUS_SHIPPED = 2;

    setCustomerEmail(email) {
        this.customerEmail = email;
    }

    getCreationDate() {
        return this.creationDate;
    }

    getGiftCertificateTotalPrice() {
        return this.giftCertificateTotalPrice;
    }

    getAdjustedMerchandizeTotalPrice() {
        return this.adjustedMerchandizeTotalPrice;
    }

    getShipments() {
        return this.shipments;
    }

    getBillingAddress() {
        return this.billingAddress;
    }

    getDefaultShipment() {
        return this.defaultShipment;
    }

    getGiftCertificateTotalPrice() {
        return this.giftCertificateTotalPrice;
    }

    getCustomerEmail() {
        return this.customerEmail;
    }

    getPaymentInstruments(paymentMethodID) {
        if (paymentMethodID) {
            const result = this.paymentInstruments
                .toArray()
                .filter(pi => pi.paymentMethod === paymentMethodID);

            return new Collection(result);
        } else {
            return this.paymentInstruments;
        }
    }

    getOrderExportXML() {
        return `<order xmlns="http://www.demandware.com/xml/impex/order/2006-10-31" order-no="00000101">
            </order>`;
    }

    setExportStatus(status) {
        this.exportStatus = status;
    }

    getOrderNo() {
        return this.orderNo;
    }

    getCustomer() {
        return this.customer;
    }

    getCustomerLocaleID = function () {
        return this.customerLocaleID;
    };

    getCurrencyCode = function () {
        return this.currencyCode;
    };

    addNote() {}

    getCustomerNo() {}

    getConfirmationStatus() {}

    getProductLineItems() {}
}

module.exports = Order;

const GiftInstances = require('../../testDataMgr/instances/dw/order/GiftCertificate');
const StatusInstances = require('../../testDataMgr/instances/dw/system/Status');

const GiftCertificateMgr = {
    createGiftCertificate: function (amount, code) {
        return GiftInstances.createGiftCertificate(amount, code);
    },
    getGiftCertificateByMerchantID: function () {
        return GiftInstances.createGiftCertificate();
    },
    getGiftCertificateByCode: function (code) {
        return GiftInstances.createGiftCertificate(50, code);
    },
    redeemGiftCertificate(paymentInstrument) {
        return paymentInstrument ? StatusInstances.createOK() : StatusInstances.createError();
    }
};

module.exports = GiftCertificateMgr;

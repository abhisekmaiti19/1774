'use strict';

const ArrayList = require('../util/ArrayList');

function Promotion(config = {}) {
    this.ID = config.ID || 'test-promotion';
    this.name = config.name || 'Test Promotion';
    this.enabled = config.enabled !== undefined ? config.enabled : true;
    this.custom = config.custom || {};
}

Promotion.prototype = {
    getID: function () {
        return this.ID;
    },
    getName: function () {
        return this.name;
    },
    isEnabled: function () {
        return this.enabled;
    }
};

function getPromotion() {
    return new ArrayList([{
        calloutMsg: {
            markup: '<p>Promo callout message markup</p>'
        },
        details: {
            markup: '<p>Promo details markup</p>'
        },
        enabled: true,
        ID: '001',
        name: 'Promo name',
        promotionClass: 'PRODUCT',
        rank: 10
    }]);
}

Promotion.getPromotion = getPromotion;
Promotion.PROMOTION_CLASS_PRODUCT = 'PRODUCT';
Promotion.PROMOTION_CLASS_ORDER = 'ORDER';
Promotion.PROMOTION_CLASS_SHIPPING = 'SHIPPING';

module.exports = Promotion;

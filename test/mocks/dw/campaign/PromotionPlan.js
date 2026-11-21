'use strict';

const Collection = require('../util/Collection');

function PromotionPlan(promotions = [], productPromotions = [], shippingPromotions = []) {
    this.promotions = new Collection(promotions);
    this.productPromotions = new Collection(productPromotions);
    this.shippingPromotions = new Collection(shippingPromotions);
}

PromotionPlan.prototype = {
    getPromotions: function () {
        return this.promotions;
    },
    getProductPromotions: function () {
        return this.productPromotions;
    },
    getShippingPromotions: function () {
        return this.shippingPromotions;
    }
};

module.exports = PromotionPlan;

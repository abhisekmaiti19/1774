const ArrayList = require('../../dw/util/Collection');
const Money = require('../../dw/value/Money');

module.exports = {
    applyDiscounts: function () {},
    activeCustomerPromotions: {
        getProductPromotions: function () {
            return [];
        }
    },
    getActiveCustomerPromotions: function () {},
    getActivePromotions: function () {
        return {
            getProductPromotions: function () {
                return [];
            }
        };
    },
    getPromotion: function () {},
    getCampaign: function () {},
    getActiveCustomerPromotionsForCampaign: function () {},
    getActivePromotionsForCampaign: function () {},
    getDiscounts: function () {
        return {
            getApproachingOrderDiscounts: function () {
                return new ArrayList([{
                    getDistanceFromConditionThreshold: function () {
                        return new Money(5, 'USD');
                    },
                    getDiscount: function () {
                        return {
                            getPromotion: function () {
                                return {
                                    getCalloutMsg: function () {
                                        return 'Order discount';
                                    },
                                    getPromotionClass: function () {
                                        return 'Order';
                                    }
                                };
                            }
                        };
                    }
                }]);
            },
            getApproachingShippingDiscounts: function () {
                return new ArrayList([{
                    getDistanceFromConditionThreshold: function () {
                        return new Money(10, 'USD');
                    },
                    getDiscount: function () {
                        return {
                            getPromotion: function () {
                                return {
                                    getCalloutMsg: function () {
                                        return 'Shipping discount';
                                    },
                                    getPromotionClass: function () {
                                        return 'Shipping';
                                    }
                                };
                            }
                        };
                    }
                }]);
            }
        };
    }
};

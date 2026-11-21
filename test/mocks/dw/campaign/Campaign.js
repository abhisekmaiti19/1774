'use strict';

function Campaign() {
    this.ID = 'test-campaign-id';
    this.name = 'Test Campaign';
    this.enabled = true;
    this.promotions = [];
}

Campaign.prototype = {
    getID: function () {
        return this.ID;
    },
    getName: function () {
        return this.name;
    },
    isEnabled: function () {
        return this.enabled;
    },
    getPromotions: function () {
        return this.promotions;
    }
};

module.exports = Campaign;

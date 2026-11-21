const sitepref = require('../../testDataMgr/sitepref');
const Calendar = require('../util/Calendar');
const List = require('../util/List');
const Locale = require('../util/Locale');
const DEFAULT_SITE_ID = 'Boilerplate-NA';

function Site() {
    this.name = 'Boilerplate';
    this.ID = global.params.siteID || DEFAULT_SITE_ID;
    this.preferences = {
        custom: {
            lowStockThreshold: 3,
            maxQtyAllowed: 3,
            enableBackInStock: true,
            enableInstantLogin: true,
            PP_API_Smart_Button_Styles: '{"smartButtonStyles":{"billing":"someBillingValue","cart":"someCardValue"}}',
            enableCheckSocialLoginOrigin: true,
            gtmEnabled: true
        }
    };
}

Site.prototype.getDefaultCurrency = function () {
    return 'USD';
};

Site.prototype.getPreferences = function () {
    return {
        getCustom: function () {
            return this.preferences.custom;
        }.bind(this)
    };
};

Site.prototype.getCustomPreferenceValue = function (preference) {
    return this.preferences.custom[preference] || sitepref[preference];
};

Site.prototype.setCustomPreferenceValue = function () {};

Site.prototype.getID = function () {
    return this.ID;
};

Site.getCurrent = function () {
    return new Site();
};

Site.getCalendar = function () {
    return new Calendar(new Date());
};

Site.prototype.getCalendar = function () {
    return Site.getCalendar();
};

Site.prototype.getAllowedCurrencies = function () {
    return new List(['USD', 'CAD']);
};

Site.prototype.getAllowedLocales = function () {
    return new List(['en_US', 'fr_FR']);
};

Site.prototype.getDefaultLocale = function () {
    return new Locale('en_US');
};

Site.prototype.getHttpsHostName = function () {
    return 'www.birkenstock.com';
};

Object.defineProperty(Site, 'current', {
    get: () => Site.getCurrent()
});

Site.getAllSites = function () {};

module.exports = Site;

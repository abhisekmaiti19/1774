const Decimal = require('./Decimal');

const moneySymbols = {
    USD: '$',
    CAD: 'C$',
    GBP: '£',
    AED: 'د.إ'
};

module.exports = {
    formatMoney: function (money) {
        const amount = Decimal.prototype.toString.call(money);

        if (amount === 'N/A') {
            return 'N/A';
        }

        const currency = moneySymbols[money.currencyCode];

        return `${currency}${amount}`;
    },
    formatNumber: function (number) {
        return String(number);
    },
    format: function (string, ...params) {
        return string.replace(/\{(\d+)}/g, (str, index) => params[index]);
    },
    formatCalendar: function () {
        return 'formatted calendar';
    },
    decodeString: function (str, formatting) {
        if (formatting === this.ENCODE_TYPE_HTML) {
            return decodeURIComponent(str);
        }

        return str;
    },
    encodeBase64: function (str) {
        return Buffer.from(str).toString('base64');
    },
    trim: function (str) {
        return str.trim();
    },
    stringToHtml: function (str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
    ENCODE_TYPE_HTML: 'ENCODE_TYPE_HTML'
};

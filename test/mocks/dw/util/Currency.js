const config = {
    USD: {
        name: 'US Dollar',
        symbol: '$',
        currencyCode: 'USD',
        defaultFractionDigits: 2
    }
};

function Currency(currencyCode) {
    if (!config[currencyCode]) {
        return;
    }

    this.name = config[currencyCode].name;
    this.defaultFractionDigits = config[currencyCode].defaultFractionDigits;
    this.currencyCode = config[currencyCode].currencyCode;
    this.symbol = config[currencyCode].symbol;
}

Currency.getCurrency = function (currencyCode) {
    return new Currency(currencyCode);
};

Currency.prototype.getCurrencyCode = function () {
    return this.currencyCode;
};

Currency.prototype.getDefaultFractionDigits = function () {
    return this.defaultFractionDigits;
};

Currency.prototype.getName = function () {
    return this.name;
};

Currency.prototype.getSymbol = function () {
    return this.symbol;
};

Currency.prototype.toString = function () {
    return this.currencyCode;
};

module.exports = Currency;

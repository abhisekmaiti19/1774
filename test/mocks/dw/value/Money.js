'use strict';

const Decimal = require('../util/Decimal');

function Money(value, currencyCode = 'USD', isAvailable = true) {
    if (!value && (value !== 0)) {
        isAvailable = false;
        value = 0.0;
    }

    this.currencyCode = currencyCode;
    this.available = isAvailable;
    this.value = value;

    this.isAvailable = function () { return this.available; };

    this.getDecimalValue = function () { return new Decimal(this.value); };

    this.getCurrencyCode = function () { return this.currencyCode; };

    this.subtract = function (money = new Money(0)) {
        const subtractValue = ((this.value * 100) - (money.value * 100)) / 100;

        return new Money(subtractValue);
    };

    this.add = function (money) {
        const addValue = ((this.value * 100) + (money.value * 100)) / 100;

        return new Money(addValue, this.currencyCode, this.available);
    };

    this.equals = function (money) {
        return (this.value * 100) === (money.value * 100);
    };

    this.divide = function (divider) {
        const dividedValue = ((this.value * 100) / divider).toFixed() / 100;

        return new Money(dividedValue);
    };

    this.valueOf = function () {
        return this.value;
    };

    this.getValue = function () {
        return this.value;
    };

    this.getValueOrNull = function () {
        return this.available ? this.value : null;
    };

    this.multiply = function (moneyValue) {
        return new Money(this.value * moneyValue);
    };

    this.addRate = function (rate) {
        return new Money(this.value * (1 + rate), this.currencyCode);
    };

    Object.defineProperty(this, 'valueOrNull', {
        get: () => this.getValueOrNull()
    });

    Object.defineProperty(this, 'decimalValue', {
        get: () => this.getDecimalValue()
    });
}

Money.prototype.toFormattedString = function () {
    return `${this.value.toFixed(2)} ${this.currencyCode}`;
};

Money.prototype.compareTo = function (otherMoney) {
    const extractNumericValue = (input) => {
        if (!input) {
            return 0;
        }

        if (typeof input.getValue === 'function') {
            return input.getValue();
        }

        return 0;
    };

    return extractNumericValue(this) - extractNumericValue(otherMoney);
};

Money.NOT_AVAILABLE = new Money('N/A', 'N/A', false);

module.exports = Money;

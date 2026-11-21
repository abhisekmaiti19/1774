function BigInteger(value) {
    this.value = value || 0;
}

BigInteger.prototype.valueOf = function () {
    return this.value;
};

BigInteger.prototype.get = function () {
    return this.value;
};

module.exports = BigInteger;

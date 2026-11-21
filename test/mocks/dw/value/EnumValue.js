function EnumValue(value, displayValue) {
    this.value = value;
    this.displayValue = displayValue;
}

EnumValue.prototype.getDisplayValue = function () {
    return this.displayValue;
};

EnumValue.prototype.getValue = function () {
    return this.value;
};

EnumValue.prototype.toString = function () {
    return this.value;
};

module.exports = EnumValue;

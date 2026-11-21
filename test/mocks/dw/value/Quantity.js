class Quantity {
    available;

    unit;

    value;

    constructor(value, unit) {
        this.value = value;
        this.unit = unit;
    }

    getUnit() {
        return this.unit;
    }

    getValue() {
        return this.value;
    }

    isAvailable() {
        return this.available;
    }
}

module.exports = Quantity;

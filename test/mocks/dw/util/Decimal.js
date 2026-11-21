class Decimal {
    constructor(value) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    /**
    * @example Decimal(23.321).toString() === '23.32'
    * @returns {string} result in format 0.00
    */
    toString() {
        if (Number.isNaN(this.value)) {
            return 'N/A';
        } else {
            return Number(this.value).toFixed(2);
        }
    }
}

module.exports = Decimal;

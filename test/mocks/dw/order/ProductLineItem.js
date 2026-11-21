class ProductLineItem {
    custom = {};

    bundledProductLineItems = [];

    setQuantityValue(value) {
        this.quantityValue = value;

        if (this.quantity) {
            this.quantity.value = value;
        }
    }

    getQuantityValue() {
        return this.quantityValue;
    }

    getProduct() {
        return this.product;
    }

    setProductInventoryList(productInventoryList) {
        this.productInventoryList = productInventoryList;
    }

    updateTax(value) {
        this.tax = value;
    }
}

module.exports = ProductLineItem;

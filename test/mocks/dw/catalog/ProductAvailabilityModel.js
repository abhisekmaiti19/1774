class ProductAvailabilityModel {
    static AVAILABILITY_STATUS_NOT_AVAILABLE = 'NOT_AVAILABLE';

    getInventoryRecord() {
        return this.inventoryRecord;
    }

    getAvailabilityLevels() {
        return this.availabilityLevels;
    }

    isInStock() {
        return this.inStock;
    }
}

module.exports = ProductAvailabilityModel;

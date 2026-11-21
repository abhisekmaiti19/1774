'use strict';

const productInventoryMgr = {
    getInventoryList: function (inventoryListId) {
        const inventoryListId0001 = {
            getRecord: function (productID) {
                const product000001 = {
                    ATS: { value: 10 }
                };

                const product000002 = {
                    ATS: { value: 3 }
                };

                const product000003 = {
                    ATS: { value: 5 }
                };

                if (productID === '000001') {
                    return product000001;
                } else if (productID === '000002') {
                    return product000002;
                } else if (productID === '000003') {
                    return product000003;
                }

                return {
                    ATS: { value: 100 }
                };
            }
        };

        const inventoryListId0002 = {
            getRecord: function (productID) {
                const product000001 = {
                    ATS: { value: 0 }
                };

                const product000002 = {
                    ATS: { value: 8 }
                };

                const product000003 = {
                    ATS: { value: 10 }
                };

                if (productID === '000001') {
                    return product000001;
                } else if (productID === '000002') {
                    return product000002;
                } else if (productID === '000003') {
                    return product000003;
                }

                return {};
            }
        };

        const inventoryListId0003 = {
            getRecord: function (productID) {
                const product000001 = {
                    ATS: { value: 10 }
                };

                const product000002 = {
                    ATS: { value: 15 }
                };

                const product000003 = {
                    ATS: { value: 8 }
                };

                if (productID === '000001') {
                    return product000001;
                } else if (productID === '000002') {
                    return product000002;
                } else if (productID === '000003') {
                    return product000003;
                }

                return {};
            }
        };

        if (inventoryListId === 'inventoryListId0001') {
            return inventoryListId0001;
        } else if (inventoryListId === 'inventoryListId0002') {
            return inventoryListId0002;
        } else if (inventoryListId === 'inventoryListId0003') {
            return inventoryListId0003;
        }

        return {};
    }
};

module.exports = {
    getInventoryList: productInventoryMgr.getInventoryList
};

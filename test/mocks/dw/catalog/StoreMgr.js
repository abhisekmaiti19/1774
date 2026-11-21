'use strict';

const storesKeySetMock = [{
    ID: 'store_1',
    name: 'Downtown TV Shop 1',
    address1: '333 Washington St 1',
    address2: '',
    city: 'Boston',
    postalCode: '01803',
    phone: '333-333-3311',
    stateCode: 'MA',
    countryCode: {
        value: 'us'
    },
    latitude: 42.5273334,
    longitude: -71.13758250000001,
    storeHours: {
        markup: 'Mon - Sat: 9am - 9pm'
    },
    getCity: function () {
        return this.city;
    },
    getAddress1: function () {
        return this.address1;
    }
},
{
    ID: 'store_2',
    name: 'Downtown TV Shop 2',
    address1: '333 Washington St 12',
    address2: '',
    city: 'Boston',
    postalCode: '01803',
    phone: '333-333-3223',
    stateCode: 'MA',
    countryCode: {
        value: 'us'
    },
    latitude: 42.5273334,
    longitude: -71.13758250000001,
    storeHours: {
        markup: 'Mon - Sat: 11am - 9pm'
    },
    getCity: function () {
        return this.city;
    },
    getAddress1: function () {
        return this.address1;
    }
},
{
    ID: 'store_3',
    name: 'Downtown TV Shop 2',
    address1: '333 Washington St 22',
    address2: '',
    city: 'Boston',
    postalCode: '01803',
    phone: '333-333-3322',
    stateCode: 'MA',
    countryCode: {
        value: 'us'
    },
    latitude: 42.5273334,
    longitude: -71.13758250000001,
    storeHours: {
        markup: 'Mon - Sat: 08am - 9pm'
    },
    getCity: function () {
        return this.city;
    },
    getAddress1: function () {
        return this.address1;
    }
},
{
    ID: 'store_4',
    name: 'Downtown TV Shop 4',
    address1: '333 Washington St 4',
    address2: '',
    postalCode: '01803',
    phone: '333-333-3355',
    stateCode: 'MA',
    countryCode: {
        value: 'us'
    },
    latitude: 42.5273334,
    longitude: -71.13758250000001,
    storeHours: {
        markup: 'Mon - Sat: 07am - 9pm'
    },
    getAddress1: function () {
        return this.address1;
    }
}];

const storeMgr = {
    searchStoresByPostalCode: function () {
        return {
            keySet: function () {
                return [{
                    ID: 'Any ID',
                    name: 'Downtown TV Shop',
                    address1: '333 Washington St',
                    address2: '',
                    city: 'Boston',
                    postalCode: '01803',
                    phone: '333-333-3333',
                    stateCode: 'MA',
                    countryCode: {
                        value: 'us'
                    },
                    latitude: 42.5273334,
                    longitude: -71.13758250000001,
                    storeHours: {
                        markup: 'Mon - Sat: 10am - 9pm'
                    }
                }];
            },
            get: function () {
                return 4.414537434967481;
            }
        };
    },

    searchStoresByCoordinates: function () {
        return {
            keySet: function () {
                return [{
                    ID: 'Any ID',
                    name: 'Downtown TV Shop',
                    address1: '333 Washington St',
                    address2: '',
                    city: 'Boston',
                    postalCode: '01803',
                    phone: '333-333-3333',
                    stateCode: 'MA',
                    countryCode: {
                        value: 'us'
                    },
                    latitude: 42.5273334,
                    longitude: -71.13758250000001,
                    storeHours: {
                        markup: 'Mon - Sat: 10am - 9pm'
                    },
                    custom: {
                        inventoryListId: 'inventoryListId0001'
                    }
                }];
            },
            get: function () {
                return 4.414537434967481;
            }
        };
    },

    searchStoresByCoordinatesWithManyStores: {
        searchStoresByCoordinates: function () {
            return {
                keySet: function () {
                    return storesKeySetMock;
                },
                get: function () {
                    return 4.414537434967481;
                }
            };
        }
    }
};

function getStore() {
    return {
        ID: 'store_1',
        name: 'Downtown TV Shop 3',
        address1: '333 Washington St 1',
        address2: '',
        city: 'Boston',
        postalCode: '01803',
        phone: '333-333-3311',
        stateCode: 'MA',
        uuid: 'uuid',
        countryCode: {
            value: 'us',
            displayValue: 'us'
        },
        latitude: 42.5273334,
        longitude: -71.13758250000001,
        storeHours: {
            markup: 'Mon - Sat: 9am - 9pm'
        },
        getCity: function () {
            return this.city;
        },
        getAddress1: function () {
            return this.address1;
        },
        custom: {
            inventoryListId: 'inventoryListId0001'
        },
        getUUID: function () {
            return this.uuid;
        }
    };
}

module.exports = {
    searchStoresByPostalCode: storeMgr.searchStoresByPostalCode,
    searchStoresByCoordinates: storeMgr.searchStoresByCoordinates,
    searchStoresByCoordinatesWithManyStores: storeMgr.searchStoresByCoordinatesWithManyStores,
    storesKeySetMock: storesKeySetMock,
    getStore: getStore
};

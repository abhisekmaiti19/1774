const ArrayList = require('../util/ArrayList');
const Collection = require('../util/Collection');
const productID = 'product-13-brown-xl';

function createProductItem() {
    return {
        setProductOptionModel: function (value) {
            return value;
        },
        setQuantityValue: function (value) {
            return value;
        },
        setPublic: function (value) {
            return value;
        }
    };
}

function isPublic() {
    return false;
}

function getProductList() {
    return {
        createProductItem: createProductItem,
        isPublic: function () { return this.public; },
        setPublic: function (value) { this.public = value; },
        public: false,
        items: new ArrayList([
            {
                productID: productID,
                quantityValue: 1,
                public: false,
                product: {
                    ID: productID,
                    optionProduct: true,
                    getOptionModel: function () {
                        return {
                            getOption: function () { return { ID: '001' }; },
                            getSelectedOptionValue: function () { return { ID: '005' }; },
                            getOptions: function () { return new ArrayList([{ ID: '007' }]); }
                        };
                    }
                },
                productOptionModel: {
                    options: new Collection({
                        displayName: 'Size',
                        displayValue: 'XS',
                        ID: 'xs'
                    }),
                    getOption: function () {},
                    getSelectedOptionValue: function () {
                        return {
                            ID: '002'
                        };
                    }
                },
                setQuantityValue: function () {},
                setPublic: function (value) { this.public = value; }
            },
            {
                productID: productID,
                quantityValue: 1,
                public: false,
                product: {
                    ID: productID,
                    optionProduct: true,
                    getOptionModel: function () {
                        return {
                            getOption: function () { return { ID: '002' }; },
                            getSelectedOptionValue: function () { return { ID: '006' }; },
                            getOptions: function () { return new ArrayList([{ ID: '008' }]); }
                        };
                    }
                },
                productOptionModel: {
                    options: new Collection({
                        displayName: 'Size',
                        displayValue: 'XS',
                        ID: 'xs'
                    }),
                    getOption: function () {},
                    getSelectedOptionValue: function () {
                        return {
                            ID: '002'
                        };
                    }
                },
                setQuantityValue: function () {},
                setPublic: function (value) { this.public = value; }
            },
            {
                productID: 'product-12-brown-xl',
                quantityValue: 1,
                public: false,
                product: {
                    optionProduct: true,
                    getOptionModel: function () {
                        return {
                            getOption: function () { return { ID: '002' }; },
                            getSelectedOptionValue: function () { return { ID: '006' }; },
                            getOptions: function () { return new ArrayList([{ ID: '008' }]); }
                        };
                    }
                },
                productOptionModel: {
                    options: new Collection({
                        ID: 'CUSTOM_TEXT',
                        displayName: 'Optional Embroidery'
                    }),
                    getOption: function () {},
                    getSelectedOptionValue: function () {
                        return {
                            ID: 'CUSTOM_TEXT'
                        };
                    }
                },
                custom: {
                    customOptionValue: 'my custom text'
                },
                setQuantityValue: function () {},
                setPublic: function (value) { this.public = value; }
            }
        ])
    };
}

function getProductListMergeTo() {
    return {
        createProductItem: createProductItem,
        isPublic: isPublic,
        items: new ArrayList([])
    };
}

module.exports = {
    getProductList: getProductList,
    getProductListMergeTo: getProductListMergeTo,
    TYPE_GIFT_REGISTRY: 11,
    TYPE_WISH_LIST: 10
};

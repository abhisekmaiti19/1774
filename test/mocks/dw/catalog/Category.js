const ArrayList = require('../util/ArrayList');
const Collection = require('../util/Collection');

const offlineSubcategory = {
    ID: 'subcategory_5_ID',
    subCategories: new Collection(),
    custom: {
        subcategoriesRenderingStyle: {
            value: 'text'
        }
    },
    isOnline: function () {
        return false;
    },
    getSubCategories: function () {
        return this.subCategories;
    },
    getOnlineSubCategories: function () {
        return new Collection();
    },
    isRoot: function () {
        return true;
    }
};

const subCategories = [
    {
        ID: 'subcategory_1_ID',
        displayName: 'displayName subcategory 1',
        custom: {
            showInMenu: true,
            alternativeUrl: 'alternativeUrl subCategory',
            isHighlighted: true,
            customMenuAssetId: 'Custom Menu Asset ID subCategory',
            categoryTileImageUrl: 'https://www.example.com/image.jpg',
            subcategoriesRenderingStyle: {
                value: 'text'
            }
        },
        subCategories: new Collection(),
        isOnline: function () {
            return true;
        },
        hasOnlineProducts: function () {
            return true;
        },
        hasOnlineSubCategories: function () {
            return false;
        },
        getDisplayName: function () {
            return this.displayName;
        },
        getSubCategories: function () {
            return this.subCategories;
        },
        getOnlineSubCategories: function () {
            return new Collection();
        },
        getID: function () {
            return this.ID;
        },
        isRoot: function () {
            return true;
        }
    },
    {
        ID: 'subcategory_2_ID',
        displayName: 'displayName subcategory 2',
        subCategories: new Collection(offlineSubcategory),
        custom: {
            subcategoriesRenderingStyle: {
                value: 'text'
            }
        },
        isOnline: function () {
            return true;
        },
        hasOnlineProducts: function () {
            return true;
        },
        hasOnlineSubCategories: function () {
            return false;
        },
        getDisplayName: function () {
            return this.displayName;
        },
        getSubCategories: function () {
            return this.subCategories;
        },
        getOnlineSubCategories: function () {
            return new Collection();
        },
        getID: function () {
            return this.ID;
        },
        isRoot: function () {
            return true;
        }
    }
];

const subCategoriesWithChild = [
    {
        ID: 'subcategory_3_ID',
        displayName: 'displayName subcategory 3',
        subCategories: new Collection(subCategories),
        custom: {
            subcategoriesRenderingStyle: {
                value: 'images'
            }
        },
        isOnline: function () {
            return true;
        },
        hasOnlineProducts: function () {
            return false;
        },
        hasOnlineSubCategories: function () {
            return false;
        },
        getDisplayName: function () {
            return this.displayName;
        },
        getSubCategories: function () {
            return this.subCategories;
        },
        getOnlineSubCategories: function () {
            return this.subCategories;
        },
        getID: function () {
            return this.ID;
        },
        isRoot: function () {
            return true;
        }
    },
    {
        ID: 'subcategory_4_ID',
        displayName: 'displayName subcategory 4',
        subCategories: new Collection(),
        custom: {
            showInMenu: true,
            subcategoriesRenderingStyle: {
                value: 'text'
            }
        },
        isOnline: function () {
            return true;
        },
        hasOnlineProducts: function () {
            return true;
        },
        hasOnlineSubCategories: function () {
            return false;
        },
        getDisplayName: function () {
            return this.displayName;
        },
        getSubCategories: function () {
            return this.subCategories;
        },
        getOnlineSubCategories: function () {
            return new Collection();
        },
        getID: function () {
            return this.ID;
        },
        isRoot: function () {
            return true;
        }
    }
];

const categoryApi = {
    displayName: 'displayName',
    ID: 'CategoryID',
    subCategories: new Collection(subCategories),
    custom: {},
    isOnline: function () {
        return true;
    },
    hasOnlineProducts: function () {
        return true;
    },
    hasOnlineSubCategories: function () {
        return true;
    },
    getDisplayName: function () {
        return this.displayName;
    },
    getOnlineSubCategories: function () {
        return this.subCategories;
    },
    getSubCategories: function () {
        return this.subCategories;
    },
    getID: function () {
        return this.ID;
    },
    isRoot: function () {
        return true;
    }
};

const Category = new ArrayList({
    ...categoryApi,
    custom: {
        showInMenu: true,
        alternativeUrl: 'alternativeUrl',
        isHighlighted: true,
        customMenuAssetId: 'Custom Menu Asset ID',
        sizeChartID: 'Custom sizeChartID',
        subcategoriesRenderingStyle: {
            value: 'text'
        },
        bottomBarAssetID: 'Bottom Bar Asset ID',
        newTab: false
    }
});

const CategoryWithSomeCustomProp = new ArrayList({
    ...categoryApi,
    custom: {
        showInMenu: true,
        showWithCustomColor: 'ff0044',
        showNavigationPipe: true,
        showCategoryInOneColumn: true,
        subcategoriesRenderingStyle: {
            value: 'text'
        },
        inactiveInCountry: ['DE']
    }
});

const CategoryWithOutCustomProp = new ArrayList({
    ...categoryApi
});

const CategoryWithOneCustomProp = new ArrayList({
    displayName: 'displayName',
    ID: 'CategoryID',
    subCategories: new Collection(subCategoriesWithChild),
    custom: {
        showInMenu: true,
        subcategoriesRenderingStyle: {
            value: 'images'
        },
        newTab: false
    },
    isOnline: function () {
        return true;
    },
    hasOnlineProducts: function () {
        return false;
    },
    hasOnlineSubCategories: function () {
        return true;
    },
    getDisplayName: function () {
        return this.displayName;
    },
    getOnlineSubCategories: function () {
        return this.subCategories;
    },
    getSubCategories: function () {
        return this.subCategories;
    },
    getID: function () {
        return this.ID;
    },
    isRoot: function () {
        return true;
    }
});

module.exports = {
    Category: Category,
    CategoryWithOutCustomProp: CategoryWithOutCustomProp,
    CategoryWithOneCustomProp: CategoryWithOneCustomProp,
    subCategoriesWithChild: subCategoriesWithChild,
    CategoryWithSomeCustomProp: CategoryWithSomeCustomProp,
    categoryApi: categoryApi
};

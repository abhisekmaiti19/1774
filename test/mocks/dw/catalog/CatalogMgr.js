function getSortingRule(ruleId) {
    return {
        ID: ruleId,
        getID: () => this.ID
    };
}

function getCategory(categoryId) {
    return {
        ID: categoryId,
        displayName: categoryId,
        online: true,
        parent: categoryId && categoryId.includes('hasParent')
    };
}

function getSiteCatalog() {
    return {
        getRoot() {
            return require('./Category').CategoryWithOneCustomProp.get(0);
        }
    };
}

module.exports = {
    getSortingRule: getSortingRule,
    getCategory: getCategory,
    getSiteCatalog: getSiteCatalog
};

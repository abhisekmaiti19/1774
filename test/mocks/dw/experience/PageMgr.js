// eslint-disable-next-line no-unused-vars
function getPageByCategory(category, pageMustBeVisible, aspectTypeID) {
    if (!category) {
        return null;
    }

    return {
        hasVisibilityRules: function () {
            return true;
        }
    };
}

// eslint-disable-next-line no-unused-vars
function getPage(pageId) {
    return {};
}

module.exports = {
    getPageByCategory,
    getPage
};

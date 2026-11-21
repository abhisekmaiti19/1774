function ProductSearchModel() {}

ProductSearchModel.CATEGORYID_PARAMETER = 'cgid';
ProductSearchModel.PRODUCTID_PARAMETER = 'pid';
ProductSearchModel.SEARCH_PHRASE_PARAMETER = 'q';

ProductSearchModel.prototype.setSearchPhrase = function (searchPhrase) {
    this.searchPhrase = searchPhrase;
};

ProductSearchModel.prototype.search = function () {
    return {

    };
};

ProductSearchModel.prototype.getProductSearchHit = function () {
    return {

    };
};

ProductSearchModel.prototype.getProductSearchHits = function () {
    return {

    };
};

ProductSearchModel.prototype.url = function (searchAction) {
    const URL = require('../web/URL');

    return new URL(searchAction, this.searchParams);
};

module.exports = ProductSearchModel;

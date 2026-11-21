const SeekableIterator = require('../util/SeekableIterator');
const List = require('../util/List');
const MediaFile = require('../content/MediaFile');

function getProduct(pid, isOffline) {
    return {
        ID: pid,
        isOnline: function () {
            return !isOffline;
        },
        getOptionModel: function () {
            return {
                getOption: function () {
                    return {};
                },
                getOptionValue: function () {
                    return {};
                },
                setSelectedOptionValue: function () {}
            };
        },
        getID: function () {
            return this.ID;
        },
        getImages: function() {
            const list = new List();
            const mediaFile1 = new MediaFile();
            const mediaFile2 = new MediaFile();

            list.add(mediaFile1);
            list.add(mediaFile2);

            return list;
        },
        optionProduct: true
    };
}

function queryAllSiteProducts() {
    return new SeekableIterator([getProduct('001'), getProduct('002', true)]);
}

module.exports = {
    getProduct: getProduct,
    queryAllSiteProducts: queryAllSiteProducts
};

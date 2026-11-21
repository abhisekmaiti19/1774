function ContentSearchModel() {
    this.pageMetaTags = [];
}

ContentSearchModel.CONTENTID_PARAMETER = 'cid';
ContentSearchModel.FOLDERID_PARAMETER = 'fdid';

ContentSearchModel.prototype.setFolderID = function (folderID) {
    this.folderID = folderID;
};

module.exports = ContentSearchModel;

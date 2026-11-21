const Collection = require('../util/Collection');

function Folder(properties) {
    if (properties) {
        Object.assign(this, properties);

        if ('custom' in properties) {
            Object.assign(this.custom, properties.custom);
        }
    }
}

Folder.prototype.getSubFolders = function () {
    return this.subFolders || new Collection();
};

Folder.prototype.getContent = function () {
    return this.content || new Collection();
};

Folder.prototype.isOnline = function () {
    return this.online;
};

module.exports = Folder;

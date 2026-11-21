function Content(properties) {
    if (properties) {
        Object.assign(this, properties);

        if ('custom' in properties) {
            Object.assign(this.custom, properties.custom);
        }
    }
}

Content.prototype.isOnline = function () {
    return this.online;
};

Content.prototype.getName = function () {
    return this.name;
};

Content.prototype.getDescription = function () {
    return this.description;
};

Content.prototype.getClassificationFolder = function () {
    return this.folders && this.folders.length
        ? this.folders[0]
        : null;
};

module.exports = Content;

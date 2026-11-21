function MarkupText(source) {
    this.source = source;
    this.markup = source;
}

MarkupText.prototype.getMarkup = function () {
    return this.markup;
};

MarkupText.prototype.getSource = function () {
    return this.source;
};

MarkupText.prototype.toString = function () {
    return this.source;
};

module.exports = MarkupText;

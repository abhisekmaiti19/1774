const ArrayList = require('../util/ArrayList');
const Iterator = require('../util/Iterator');

function PagingModel(elements) {
    this.count = elements.length;
    this.start = 0;
    this.pageSize = elements.length;

    if (Array.isArray(elements)) {
        this.elements = elements;
    } else if (elements instanceof ArrayList) {
        this.elements = elements.toArray();
    } else {
        this.elements = [];
    }

    Object.defineProperty(this, 'end', {
        get: () => this.getEnd()
    });

    Object.defineProperty(this, 'pageElements', {
        get: () => this.getPageElements()
    });

    Object.defineProperty(this, 'currentPage', {
        get: () => this.getCurrentPage()
    });
}

PagingModel.PAGING_SIZE_PARAMETER = 'sz';
PagingModel.PAGING_START_PARAMETER = 'start';

PagingModel.prototype.getPageElements = function () {
    return new Iterator(Array.prototype.slice.call(this.elements, this.start, this.start + this.pageSize));
};

PagingModel.prototype.getEnd = function () {
    const lastIndex = this.count - 1;
    const end = this.start + this.pageSize - 1;

    return end <= lastIndex ? end : lastIndex;
};

PagingModel.prototype.setStart = function (start) {
    this.start = start;
};

PagingModel.prototype.setPageSize = function (pageSize) {
    this.pageSize = pageSize;
};

PagingModel.prototype.appendPaging = function (url) {
    url.append(PagingModel.PAGING_START_PARAMETER, this.start);
    url.append(PagingModel.PAGING_SIZE_PARAMETER, this.pageSize);

    return url;
};

PagingModel.prototype.getCurrentPage = function () {
    return Math.floor(this.start / this.pageSize);
};

module.exports = PagingModel;

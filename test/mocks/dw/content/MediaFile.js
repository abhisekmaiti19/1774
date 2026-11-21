const URL = require('../web/URL');

class MediaFile {
    absURL = new URL('Image-Url');

    alt = 'alt';

    httpsURL = new URL('Image-Url');

    httpURL = new URL('Image-Url');

    title = 'title';

    URL = new URL('Image-Url');

    viewType = 'md';

    getAbsImageURL() {
        return this.absURL;
    }

    getAbsURL() {
        return this.absURL;
    }

    getAlt() {
        return this.alt;
    }

    getHttpImageURL() {
        return this.httpURL;
    }

    getHttpsImageURL() {
        return this.httpsURL;
    }

    getHttpsURL() {
        return this.httpsURL;
    }

    getHttpURL() {
        return this.httpURL;
    }

    getImageURL() {
        return this.URL;
    }

    getTitle() {
        return this.title;
    }

    getURL() {
        return this.URL;
    }

    getViewType() {
        return this.viewType;
    }
}

module.exports = MediaFile;

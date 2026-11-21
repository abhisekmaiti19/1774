class MimeEncodedText {
    encoding = 'UTF-8';

    mimeType = 'text/html';

    text;

    constructor(text, mimeType, encoding) {
        this.text = text;
        this.mimeType = mimeType || this.mimeType;
        this.encoding = encoding || this.encoding;
    }

    getText() {
        return this.text;
    }

    getMimeType() {
        return this.mimeType;
    }

    getEncoding() {
        return this.encoding;
    }
}

module.exports = MimeEncodedText;

class HTTPClient {
    /**
     * @type {import('../util/Map')}
     */
    responseHeaders;

    getResponseHeader(header) {
        return this.responseHeaders.get(header);
    }

    getResponseHeaders() {
        return this.responseHeaders;
    }
}

module.exports = HTTPClient;

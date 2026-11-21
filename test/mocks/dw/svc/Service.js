class Service {
    call() {}

    getConfiguration() {
        return this.configuration;
    }

    getCredentialID() {
        return this.credentialID;
    }

    getRequestData() {
        return this.requestData;
    }

    getResponse() {
        return this.response;
    }

    getURL() {
        return this.URL;
    }

    isMock() {
        return this.mock;
    }

    isThrowOnError() {
        return this.throwOnError;
    }

    setCredentialID(id) {
        this.credentialID = id;

        return this;
    }

    setMock() {
        this.mock = true;

        return this;
    }

    setThrowOnError() {
        this.throwOnError = true;

        return this;
    }

    setURL(url) {
        this.URL = url;

        return true;
    }
}

module.exports = Service;

const Service = require('./Service');

class HTTPService extends Service {
    authentication;

    requestMethod;

    client;

    addHeader() {
        return this;
    }

    addParam(name, val) {
        this.URL += name + '=' + val + ';';

        return this;
    }

    getAuthentication() {
        return this.authentication;
    }

    getClient() {
        return this.client;
    }

    getRequestMethod() {
        return this.requestMethod();
    }

    setAuthentication(authentication) {
        this.authentication = authentication;

        return this;
    }

    setRequestMethod(requestMethod) {
        this.requestMethod = requestMethod;

        return this;
    }
}

module.exports = HTTPService;

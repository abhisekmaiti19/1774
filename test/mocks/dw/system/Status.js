const Map = require('../util/Map');

class Status {
    static ERROR = 0;

    static OK = 1;

    static NO_FILE_FOUND = 2;

    constructor(status, code, message, parameters) {
        this.details = new Map();

        if (status !== undefined) {
            this.status = status;
        }

        if (code !== undefined) {
            this.code = code;
        }

        if (message !== undefined) {
            this.message = message;
        }

        if (parameters !== undefined) {
            this.parameters = parameters;
        }

        if (status === Status.ERROR) {
            this.error = true;
        } else if (status === Status.OK) {
            this.error = false;
        }
    }

    isError() {
        return this.error;
    }

    getStatus() {
        return this.status;
    }

    getCode() {
        return this.code;
    }

    addDetail(key, value) {
        this.details.put(key, value);
    }

    getDetail(key) {
        return this.details.get(key);
    }

    getMessage() {
        return this.message;
    }
}

module.exports = Status;

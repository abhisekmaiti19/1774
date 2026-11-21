class Result {
    static ERROR = 'ERROR';

    static OK = 'OK';

    static SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE';

    static UNAVAILABLE_CIRCUIT_BROKEN = 'CIRCUIT_BROKEN';

    static UNAVAILABLE_CONFIG_PROBLEM = 'CONFIG_PROBLEM';

    static UNAVAILABLE_DISABLED = 'DISABLED';

    static UNAVAILABLE_RATE_LIMITED = 'RATE_LIMITED';

    static UNAVAILABLE_TIMEOUT = 'TIMEOUT';

    error;

    errorMessage;

    msg;

    object;

    status;

    unavailableReason;

    mockResult;

    ok;

    getError() {
        return this.error;
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    getMsg() {
        return this.msg;
    }

    getObject() {
        return this.object;
    }

    getStatus() {
        return this.status;
    }

    getUnavailableReason() {
        return this.unavailableReason;
    }

    isMockResult() {
        return this.mockResult;
    }

    isOk() {
        return this.ok;
    }
}

module.exports = Result;

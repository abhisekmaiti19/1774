const sinon = require('sinon');

module.exports = {
    warn: sinon.spy(),
    error: sinon.spy(),
    fatal: sinon.spy(),
    info: sinon.spy(),
    debug: sinon.spy(),
    getLogger: function () {
        return {
            error: this.error,
            fatal: this.fatal,
            debug: this.debug,
            warn: this.warn,
            info: this.info
        };
    },
    isDebugEnabled: () => true
};

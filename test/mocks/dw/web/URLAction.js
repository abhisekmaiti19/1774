class URLAction {
    constructor(...params) {
        this.params = params;
    }

    toString() {
        return this.params.join(':');
    }
}

module.exports = URLAction;

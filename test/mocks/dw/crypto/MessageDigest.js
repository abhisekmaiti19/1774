function MessageDigest() {
    this.digestBytes = function (bytes) {
        return bytes;
    };

    this.updateBytes = function () {
    };

    this.digest = function () {
        const Bytes = require('#mocks/dw/util/Bytes');

        return new Bytes('a1b2c3d4e5f6');
    };
}

module.exports = MessageDigest;

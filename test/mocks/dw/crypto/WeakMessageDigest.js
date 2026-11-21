function WeakMessageDigest() {
    this.digestBytes = function (bytes) {
        return bytes;
    };
}

module.exports = WeakMessageDigest;

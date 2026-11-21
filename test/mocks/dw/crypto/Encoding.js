function Encoding() {}

Encoding.toHex = function (digested) {
    return 'encoded in hex:' + digested.bytes;
};

Encoding.toBase64 = function (digested) {
    return 'encoded in Base64:' + digested.bytes;
};

module.exports = Encoding;

function Mac() {}

Mac.prototype.digest = function (data, bytesKey) {
    return data + bytesKey;
};

module.exports = Mac;

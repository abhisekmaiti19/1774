const safeParseJSON = function (value) {
    if (!value) {
        return {};
    }
    try {
        return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (err) {
        return {};
    }
}

module.exports = {
    safeParseJSON: safeParseJSON
}



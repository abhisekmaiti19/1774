module.exports = {
    forJSONValue: function (inputValue) {
        return 'JSON-safe ' + inputValue;
    },
    forHtmlContent: function (inputValue) {
        return inputValue;
    },
    forUriComponentStrict: function (inputValue) {
        return inputValue;
    },
    forHtmlInDoubleQuoteAttribute: function (inputValue) {
        return inputValue;
    }
};

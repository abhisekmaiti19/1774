function FormElementValidationResult(value) {
    this.valid = value;
}

FormElementValidationResult.prototype.setValid = function (value) {
    this.valid = value;
};

FormElementValidationResult.prototype.setMessage = function (value) {
    this.message = value;
};

module.exports = FormElementValidationResult;

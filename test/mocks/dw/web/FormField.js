/* eslint-disable no-multi-assign */
const FormField = function (obj) { this.init.call(this, obj); };

FormField.FIELD_TYPE_BOOLEAN = FormField.prototype.FIELD_TYPE_BOOLEAN = 5;
FormField.FIELD_TYPE_DATE = FormField.prototype.FIELD_TYPE_DATE = 4;
FormField.FIELD_TYPE_INTEGER = FormField.prototype.FIELD_TYPE_INTEGER = 3;
FormField.FIELD_TYPE_NUMBER = FormField.prototype.FIELD_TYPE_NUMBER = 2;
FormField.FIELD_TYPE_STRING = FormField.prototype.FIELD_TYPE_STRING = 1;

FormField.prototype.init = function (obj) {
    Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
    }, this);
};

FormField.prototype.getType = function () {
    return this.type || FormField.FIELD_TYPE_STRING;
};

FormField.prototype.setValue = function (value) {
    this.value = value;
    this.htmlValue = (value || '') + '';
};

FormField.prototype.invalidateFormElement = function () {
    this.valid = false;
};

module.exports = FormField;

const FormGroup = function (obj) { this.init.call(this, obj); };

FormGroup.prototype.init = function (obj) {
    Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
    }, this);
};

module.exports = FormGroup;

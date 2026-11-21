const FormAction = function (obj) { this.init.call(this, obj); };

FormAction.prototype.init = function (obj) {
    Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
    }, this);
};

module.exports = FormAction;

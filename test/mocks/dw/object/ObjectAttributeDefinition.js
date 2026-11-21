const Collection = require('../util/Collection');

class ObjectAttributeDefinition {
    static VALUE_TYPE_BOOLEAN = 8;

    static VALUE_TYPE_DATE = 6;

    static VALUE_TYPE_DATETIME = 11;

    static VALUE_TYPE_EMAIL = 12;

    static VALUE_TYPE_ENUM_OF_INT = 31;

    static VALUE_TYPE_ENUM_OF_STRING = 33;

    static VALUE_TYPE_HTML = 5;

    static VALUE_TYPE_IMAGE = 7;

    static VALUE_TYPE_INT = 1;

    static VALUE_TYPE_MONEY = 9;

    static VALUE_TYPE_NUMBER = 2;

    static VALUE_TYPE_PASSWORD = 13;

    static VALUE_TYPE_QUANTITY = 10;

    static VALUE_TYPE_SET_OF_INT = 21;

    static VALUE_TYPE_SET_OF_NUMBER = 22;

    static VALUE_TYPE_SET_OF_STRING = 23;

    static VALUE_TYPE_STRING = 3;

    static VALUE_TYPE_TEXT = 4;

    getAttributeDefinitions() {
        return new Collection();
    }
}

module.exports = ObjectAttributeDefinition;

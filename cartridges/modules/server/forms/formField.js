'use strict';

var siteId;
var locale;
var currency;
var cacheInstance;
var formFieldInstances = {};

/**
 * Generate cache key for field instance.
 * @param {dw.web.FormField} field - SFCC form field for generating cache key for it
 * @returns {string} cache key
 */
function getCacheKey(field) {
    if (!siteId) {
        siteId = require('dw/system/Site').getCurrent().getID();
    }
    if (!locale) {
        locale = request.locale;
    }
    if (!currency) {
        currency = session.currency.currencyCode;
    }

    return siteId + locale + currency + field.htmlName;
}

/**
 * @description Update the cached field with the new options
 * @param {dw.web.FormField} field - SFCC form field
 * @param {object} options Plain object with field options
 */
function updateOptionsCachedFormField(field, options) {
    if (!field || !options) {
        return;
    }

    var cachedField = formFieldInstances[field.htmlName];

    if (cachedField) {
        cachedField.options = options;
    }
}

/**
 * Get cache instance for storing cached form fields.
 * @returns {dw.system.Cache} cache instance
 */
function getCache() {
    if (!cacheInstance) {
        var CacheMgr = require('dw/system/CacheMgr');
        cacheInstance = CacheMgr.getCache('formFields');
    }
    return cacheInstance;
}

/**
 * Get base attributes for form field that not related to particular session and can be cached.
 * @param {dw.web.FormField} field - SFCC form field for generating attributes
 * @returns {string} input field attributes
 */
function getBaseAttributes(field) {
    var attributes = 'name="' + field.htmlName + '"';

    if (field.mandatory) {
        attributes += ' required';
        attributes += ' aria-required="true"';
    }
    if (field.options && field.options.optionsCount > 0) {
        return attributes;
    }
    if (field.maxValue) {
        attributes += ' max="' + field.maxValue + '"';
    }
    if (field.minValue) {
        attributes += ' min="' + field.minValue + '"';
    }
    if (field.maxLength) {
        attributes += ' maxLength="' + field.maxLength + '"';
    }
    if (field.minLength) {
        attributes += ' minLength="' + field.minLength + '"';
    }
    if (field.regEx) {
        attributes += ' pattern="' + field.regEx + '"';
    }
    return attributes;
}

/**
 * Get user specific attributes for form field
 * @param {dw.web.FormField} field - SFCC form field for generating attributes
 * @param {string} attributes - base not user specific attributes
 * @returns {string} input field attributes populated with session specific attributes
 */
function getUserSpecificAttributes(field, attributes) {
    var value = field.htmlValue == null ? '' : field.htmlValue;
    var secureEncoder = require('dw/util/SecureEncoder');
    attributes += ' value="' + secureEncoder.forHtmlInDoubleQuoteAttribute(value) + '"';

    if (field.type === field.FIELD_TYPE_BOOLEAN && field.checked) {
        attributes += ' checked="' + field.checked + '"';
    }

    return attributes;
}

/**
 * Get base form field object that represent SFCC form field.
 * This object not contain user specific information and can be cached
 * @param {dw.web.FormField} field - SFCC form field for generating attributes
 * @returns {object} base JS object representation of FormField instance
 */
function generateBaseFormField(field) {
    var resource = require('dw/web/Resource');

    var result = {
        baseAttributes: getBaseAttributes(field)
    };

    var attributesToCopy = {
        string: ['maxLength', 'minLength', 'regEx'],
        int: ['maxValue', 'minValue'],
        common: ['mandatory', 'htmlName'],
        resources: ['description', 'label']
    };

    attributesToCopy.common.forEach(function (item) {
        result[item] = field[item] || '';
    });

    attributesToCopy.resources.forEach(function (item) {
        if (field[item]) {
            result[item] = resource.msg(field[item], 'forms', null);
        }
    });

    switch (field.type) {
        case field.FIELD_TYPE_DATE:
        case field.FIELD_TYPE_INTEGER:
        case field.FIELD_TYPE_NUMBER:
            attributesToCopy.int.forEach(function (item) {
                result[item] = field[item];
            });
            break;
        case field.FIELD_TYPE_STRING:
            attributesToCopy.string.forEach(function (item) {
                result[item] = field[item];
            });
            break;
        default:
            break;
    }

    result.formType = 'formField';

    return result;
}

/**
 * Copy field attributes from immutable cached form field to new object
 * @param {object} from - source object
 * @param {object} to - destination object
 */
function copyCachedAttributes(from, to) {
    var keys = Object.keys(from);
    var key;

    for (let i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        if (key === 'baseAttributes') {
            continue;
        }
        to[key] = from[key];
    }
}

/**
 * @description Gets array of plain objects representing field options
 * @param {dw.web.FormField} field - form field
 * @returns
 */
function getOptions(field) {
    var resource = require('dw/web/Resource');
    var options = [];

    if (!field.options) {
        return options;
    }

    for (var i = 0, l = field.options.optionsCount; i < l; i++) {
        options.push({
            checked: field.options[i].checked,
            htmlValue: field.options[i].htmlValue,
            label: field.options[i].label
                ? resource.msg(field.options[i].label, 'forms', null)
                : '',
            id: field.options[i].optionId,
            selected: field.options[i].selected,
            value: field.options[i].value
        });
    }

    return options;
}

/**
 * Function to convert <dw.web.FormField> object to plain JS object.
 *
 * @param  {dw.web.FormField} field original formField object.
 * @returns {object} Plain JS object representing formField.
 */
function formField(field) {
    if (formFieldInstances[field.htmlName]) {
        // Make formField as singleton
        return formFieldInstances[field.htmlName];
    }

    var cache = getCache();
    var cacheKey = getCacheKey(field);

    var cachedFormField = cache.get(cacheKey);
    var result = {};
    var cachedOptions;

    if (!cachedFormField) {
        cachedFormField = generateBaseFormField(field);
        // Caching of objects of type Date is not supported.
        if (field.getType() !== field.FIELD_TYPE_DATE) {
            cache.put(cacheKey, cachedFormField);
        }
    }

    Object.defineProperty(result, 'attributes', {
        enumerable: true,
        get: function () {
            var attributes = cachedFormField.baseAttributes;

            if (field.options && field.options.optionsCount > 0) {
                return attributes;
            }

            return getUserSpecificAttributes(field, attributes);
        }
    });

    Object.defineProperty(result, 'value', {
        enumerable: true,
        get: function () {
            return field.value;
        },
        set: function (value) {
            field.setValue(value);
        }
    });

    Object.defineProperty(result, 'htmlValue', {
        enumerable: true,
        get: function () {
            return field.htmlValue || '';
        },
        set: function (htmlValue) {
            field.htmlValue = htmlValue;
        }
    });

    Object.defineProperty(result, 'valid', {
        enumerable: true,
        get: function () {
            return field.valid;
        },
        set: function (isValid) {
            if (!isValid) {
                field.invalidateFormElement();
            }
        }
    });

    Object.defineProperty(result, 'dynamicHtmlName', {
        enumerable: true,
        get: function () {
            return field.dynamicHtmlName;
        }
    });

    Object.defineProperty(result, 'error', {
        enumerable: true,
        get: function () {
            if (field.error) {
                return require('dw/web/Resource').msg(field.error, 'forms', null);
            }
            return null;
        },
        set: function (errorMsg) {
            if (errorMsg) {
                field.invalidateFormElement(errorMsg);
            }
        }
    });

    if (field.options && field.options.optionsCount > 0) {
        Object.defineProperty(result, 'options', {
            enumerable: true,
            get: function () {
                if (typeof cachedOptions === 'undefined') {
                    cachedOptions = getOptions(field);
                }

                return cachedOptions;
            },
            set: function(newOptions) {

                cachedOptions = newOptions;
            }
        });

        Object.defineProperty(result, 'selectedOption', {
            enumerable: true,
            get: function () {
                return field.selectedOption ? field.selectedOption.optionId : '';
            },
            set: function(optionValue) {
                if (!optionValue) {
                    return;
                }

                field.setValue(optionValue);
            }
        });
    }

    result.setOptions = function (options) {
        if (!options || (typeof options.iterator !== 'function')) {
            return;
        }

        field.setOptions(options.iterator());

        var optionsObject = getOptions(field);

        this.options = optionsObject;
        updateOptionsCachedFormField(field, optionsObject);

        cachedOptions = undefined;
    }

    result.selectOption = function(optionValue) {
        this.selectedOption = optionValue;
    }


    if (field.type === field.FIELD_TYPE_BOOLEAN) {
        Object.defineProperty(result, 'checked', {
            enumerable: true,
            get: function () {
                return field.checked;
            },
            set: function (checked) {
                field.setValue(checked);
            }
        });

        Object.defineProperty(result, 'selected', {
            enumerable: true,
            get: function () {
                return field.selected;
            }
        });
    }

    copyCachedAttributes(cachedFormField, result);

    formFieldInstances[field.htmlName] = result;

    return result;
}

module.exports = formField;

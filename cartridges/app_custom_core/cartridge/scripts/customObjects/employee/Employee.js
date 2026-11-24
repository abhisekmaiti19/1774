/* eslint-disable sonarjs/no-duplicate-string */

'use strict';

/**
 * @typedef {object} EmployeeCustomObject
 * @property {string} type - Type of the custom object, should be 'Employee'
 * @property {object} custom - Custom attributes of the employee
 * @property {string} custom.ID - Employee ID code
 * @property {string} custom.customerNumber - Customer number assigned when redeeming the employee benefits by registering a SFCC account
 * @property {string} custom.zipCode - Employee zip code
 * @property {string} custom.countryCode - Employee country code
 * @property {string} custom.companyID - Company ID
 * @property {object} custom.companyBenifits - Container for all benefit data of the employee
 * @property {object} custom.companyBenifits.discountDetails - Existing employee discount:
 *   { discountGroup, customAnnualDiscountAllowance, annualDiscountUsage, unlimitedDiscount, lastAllowanceReset }
 * @property {object} custom.companyBenifits.benifitDetailsByCategory - Separate allowance per product category (e.g. 1774):
 *   { "<category>": { isActive, annualDiscountAllowance, discountUsage } }
 */

/**
 *
 * @param {EmployeeCustomObject} apiEmployee - CustomObject of Employee type
 */

function Employee(apiEmployee) {
    this.apiEmployee = apiEmployee;

    this.initialize();

    return this;
}

/**
 * @description Initialize Employee instance by setting properties based on the apiEmployee object.
 *
 * @returns {void}
 *
 * @throws {Error} if apiEmployee is not a valid custom object of type 'Employee'
 */

Employee.prototype.initialize = function () {
    const type = this.apiEmployee && this.apiEmployee.type || null;

    if (!type || type !== 'Employee') {
        throw new Error('Invalid constructor argument: apiEmployee must be a custom object of type "Employee". Received [' +
            JSON.stringify(this.apiEmployee) + '] instead.');
    }

    if (empty(this.customerNumber)) {
        return;
    }

    const CustomerMgr = require('dw/customer/CustomerMgr');
    const customer = CustomerMgr.getCustomerByCustomerNumber(this.customerNumber);

    if (!customer) {
        const Logger = require('dw/system/Logger').getLogger('employee');

        Logger.info('Customer with customerNumber {0} linked to employee {1} does not exist. Clearing customerNumber attribute from employee.',
            this.customerNumber, this.ID);

        const Transaction = require('dw/system/Transaction');

        Transaction.wrap(function () {
            this.apiEmployee.custom.customerNumber = null;
        }.bind(this));
    }

    this.customer = customer;
};

const customObjectAttributes = [
    'ID',
    'customerNumber',
    'zipCode',
    'countryCode',
    'companyID',
    'companyBenifits'
];

const readOnlyAttributes = [
    'ID',
    'customerNumber',
    'countryCode',
    'companyID',
    'annualDiscountUsage',
    'lastAllowanceReset'
];
const discountDetailAttributes = [
    'discountGroup',
    'customAnnualDiscountAllowance',
    'annualDiscountUsage',
    'unlimitedDiscount',
    'lastAllowanceReset'
];

/**
 * @description Get the standard discount details object from the employee's custom benefits,
 * initializing missing benefit containers on the custom object so reads and writes share one reference.
 *
 * @param {Employee} employee - Employee instance whose discount details are accessed.
 *
 * @returns {object} Standard discount details object (`{ discountGroup, customAnnualDiscountAllowance, annualDiscountUsage, unlimitedDiscount, lastAllowanceReset }`).
 */
function getDiscountDetails(employee) {
    const custom = employee.apiEmployee.custom;

    if (!custom.companyBenifits) {
        custom.companyBenifits = {};
    }

    if (!custom.companyBenifits.discountDetails) {
        custom.companyBenifits.discountDetails = {};
    }

    return custom.companyBenifits.discountDetails;
}

/**
 * @description Define getters for EmployeeCustomObject's properties based on its custom attributes,
 * and also setters for the attributes that are not read-only.
 *
 * @returns {void}
 *
 * @throws {Error} if an attempt is made to set a read-only property.
 */
const Transaction = require('dw/system/Transaction');

customObjectAttributes.forEach(function (field) {
    Object.defineProperty(Employee.prototype, field, {
        get: function () {
            return this.apiEmployee.custom[field];
        },
        enumerable: true,
        configurable: false,
        set: function (value) {
            if (readOnlyAttributes.includes(field)) {
                throw new Error('Cannot set read-only property ' + field + ' on Employee instance.');
            }

            Transaction.wrap(function () {
                this.apiEmployee.custom[field] = value;
            }.bind(this));
        }
    });
});

discountDetailAttributes.forEach(function (field) {
    Object.defineProperty(Employee.prototype, field, {
        get: function () {
            return getDiscountDetails(this)[field];
        },
        enumerable: true,
        configurable: false,
        set: function (value) {
            if (readOnlyAttributes.includes(field)) {
                throw new Error('Cannot set read-only property ' + field + ' on Employee instance.');
            }
            Transaction.wrap(function () {
                getDiscountDetails(this)[field] = value;
            }.bind(this));
        }
    });
});



/**
 * @description Get the employee's annual discount allowance: either from the custom attribute when a personal value is set,
 * or computed by the EmployeeMgr's method based on the country code and discount group.
 *
 * @returns {number} employee's annual discount allowance.
 */

Object.defineProperty(Employee.prototype, 'annualDiscountAllowance', {
    get: function () {
        const EmployeeMgr = require('*/cartridge/scripts/customObjects/employee/EmployeeMgr');

        return this.customAnnualDiscountAllowance || EmployeeMgr.getAnnualDiscountAllowance(this.countryCode, this.discountGroup);
    },
    enumerable: true,
    configurable: false
});


/**
 * @description Retrieve the benefit configuration and usage entry for a specific product category.
 *
 * @param {Employee} employee - Employee instance to inspect.
 * @param {string|number} category - Category identifier (e.g., `'1774'`).
 *
 * @returns {object|null} Category benefit entry (`{ isActive, annualDiscountAllowance, discountUsage }`) or `null` if not found.
 */
function getCategoryBenefit(employee, category) {
    const benefits = employee.apiEmployee.custom.companyBenifits;
    const byCategory = benefits && benefits.benifitDetailsByCategory;

    return (byCategory && byCategory[category]) || null;
}



/**
 * @description Increase the annual discount usage by the specified amount.
 * Without a category the existing employee allowance is used (exempt when unlimitedDiscount is set).
 * With a category the separate allowance of that category is used; unlimitedDiscount never exempts it.
 * @param {number} amount - amount to increase the annual discount usage by.
 * @param {string|number} [category] - category benefit to charge, e.g. '1774'.
 * @returns {void}
 * @throws {Error} if the amount is not a non-negative number
 * @throws {Error} if the category benefit is missing or inactive
 * @throws {Error} if the amount would exceed the annual discount allowance (or the category allowance).
 */
Employee.prototype.increaseAnnualDiscountUsage = function (amount, category) {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        throw new Error('Cannot increase annual allowance usage: amount must be a non-negative number');
    }

    if (!empty(category)) {
        const categoryBenefit = getCategoryBenefit(this, category);
        if (!categoryBenefit || !categoryBenefit.isActive) {
            throw new Error('Category benefit "' + category + '" is inactive or missing');
        }
        const currentUsage = categoryBenefit.discountUsage || 0;
        if (currentUsage + amount > categoryBenefit.annualDiscountAllowance) {
            throw new Error('Cannot increase category allowance usage: allowance exceeded');
        }
        categoryBenefit.discountUsage = currentUsage + amount;
        return;
    }

    if (this.unlimitedDiscount) {
        return;
    }

    const currentUsage = getDiscountDetails(this).annualDiscountUsage || 0;
    if (currentUsage + amount > this.annualDiscountAllowance) {
        throw new Error('Cannot increase annual allowance usage: allowance exceeded');
    }
    getDiscountDetails(this).annualDiscountUsage = currentUsage + amount;
};

/**
 * @description Decrease the annual discount usage by the specified amount.
 * Works for inactive category benefits as well, so refunds are still possible after a benefit was deactivated.
 *
 * @param {number} amount - amount to decrease the annual discount usage by.
 * @param {string|number} [category] - category benefit to refund, e.g. '1774'.
 *
 * @returns {void}
 *
 * @throws {Error} if the amount is not a non-negative number
 * @throws {Error} if the category benefit does not exist
 * @throws {Error} if the amount would result in a negative annual discount usage.
 */
Employee.prototype.decreaseAnnualDiscountUsage = function (amount, category) {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        throw new Error('Cannot decrease annual allowance usage: amount must be a non-negative number');
    }

    if (!empty(category)) {
        const categoryBenefit = getCategoryBenefit(this, category);
        if (!categoryBenefit) {
            throw new Error('Category benefit "' + category + '" not found');
        }
        const currentUsage = categoryBenefit.discountUsage || 0;
        if (currentUsage - amount < 0) {
            throw new Error('Cannot decrease category allowance usage: allowance below zero');
        }
        categoryBenefit.discountUsage = currentUsage - amount;
        return;
    }

    if (this.unlimitedDiscount) {
        return;
    }

    const currentUsage = getDiscountDetails(this).annualDiscountUsage || 0;
    if (currentUsage - amount < 0) {
        throw new Error('Cannot decrease annual discount usage: allowance below zero');
    }
    getDiscountDetails(this).annualDiscountUsage = currentUsage - amount;
};

/**
 * @description Reset the annual discount usage to zero.
 *
 * @returns {void}
 */

Employee.prototype.resetAnnualDiscountUsage = function () {
    this.decreaseAnnualDiscountUsage(this.annualDiscountUsage || 0);
    getDiscountDetails(this).lastAllowanceReset = new Date().toISOString();

    // Assuming (the category allowance is an ANNUAL cap): the yearly reset also clears every category usage (e.g. 1774).
    const benefits = this.apiEmployee.custom.companyBenifits;
    const byCategory = (benefits && benefits.benifitDetailsByCategory) || {};

    Object.keys(byCategory).forEach(function (category) {
        byCategory[category].discountUsage = 0;
    });
};

/**
 * @description Update the annual discount allowance.
 *
 * @param {number} newAllowance - new annual discount allowance to set.
 *
 * @returns {void}
 *
 * @throws {Error} if the new allowance is not a non-negative number.
 */

Employee.prototype.updateCustomAnnualDiscountAllowance = function (newAllowance) {
    if (typeof newAllowance !== 'number' || newAllowance < 0) {
        throw new Error('New allowance must be a non-negative number');
    }

    this.customAnnualDiscountAllowance = newAllowance;
};

/**
 * @description Calculate the remaining annual discount based on the allowance and usage.
 *
 * @returns {number} remaining annual discount allowance.
 *
 * @throws {Error} if an attempt is made to set this read-only property.
 */

Object.defineProperty(Employee.prototype, 'remainingAnnualDiscount', {
    get: function () {
        return this.annualDiscountAllowance - this.annualDiscountUsage;
    },
    enumerable: true,
    configurable: false,
    set: function () {
        throw new Error('remainingAnnualDiscount is a read-only property derived from annualDiscountAllowance and annualDiscountUsage. ' +
            'You should rather update annualDiscountUsage by using increaseAnnualDiscountUsage and decreaseAnnualDiscountUsage methods.');
    }
});

/**
 * @description Check if the employee has redeemed their benefits by registering an account.
 *
 * @returns {boolean} true if the employee has a customer number (ID of the account redeeming the benefits), false otherwise.
 */

Object.defineProperty(Employee.prototype, 'isRegistered', {
    enumerable: true,
    get: function () {
        return !empty(this.apiEmployee.custom.customerNumber);
    }
});

/**
 * @description Check if the employee is external (partner company) or internal (Birkenstock) based on the companyID.
 *
 * @returns {boolean} true if the employee is external (partner), false if internal (Birkenstock).
 */

Object.defineProperty(Employee.prototype, 'isExternal', {
    enumerable: true,
    get: function () {
        return !empty(this.apiEmployee.custom.companyID);
    }
});

/**
 * @description Link the employee to a customer profile by setting the customer number.
 *
 * @param {dw.customer.Profile} profile - customer profile to set.
 *
 * @returns {void}
 *
 * @throws {Error} if the customer profile is not provided.
 * @throws {Error} if the customer profile is already linked to an employee.
 * @throws {Error} if the employee is already linked to a customer.
 */
Employee.prototype.setCustomer = function (profile) {
    if (!profile) {
        throw new Error('Invalid argument: profile must be provided.');
    }

    const isLegacyEmployee = profile.custom.isEmployee;

    if (!empty(profile.custom.employeeNumber) && !isLegacyEmployee) {
        throw new Error('Cannot set customer for employee ' + this.ID + ': profile is already linked to an employee with number ' +
            profile.custom.employeeNumber + '.');
    }

    const customerNumber = profile.customerNo;

    if (this.isRegistered) {
        throw new Error('Cannot set customer number ' + customerNumber + ' for employee ' + this.ID +
            ': employee is already registered with customer number ' + this.customerNumber + '.');
    }

    const EmployeeMgr = require('*/cartridge/scripts/customObjects/employee/EmployeeMgr');
    const existingEmployee = EmployeeMgr.getEmployeeByCustomerNumber(customerNumber);

    if (existingEmployee) {
        throw new Error('Cannot set customer number ' + customerNumber + ' for employee ' + this.ID +
            ': customer number is already in use by another employee with ID ' + existingEmployee.custom.ID + '.');
    }

    const Transaction = require('dw/system/Transaction');

    Transaction.wrap(function () {
        profile.custom.employeeNumber = this.ID;
        this.apiEmployee.custom.customerNumber = customerNumber;
        this.customer = profile.customer;
    }.bind(this));
};

/**
 * @description Unlink the customer profile the employee is associated with by clearing the employee's customer number and the profile's employee number.
 */

Employee.prototype.resetCustomer = function () {
    if (!this.isRegistered) {
        return;
    }

    const Transaction = require('dw/system/Transaction');
    const accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');

    Transaction.wrap(function () {
        accountHelpers.clearEmployeeLegacyAttributes(this.customer.profile);
        this.apiEmployee.custom.customerNumber = null;
        this.customer.profile.custom.employeeNumber = null;
        this.customer = null;
    }.bind(this));
};

/**
 * @description Check if the employee has enough remaining annual discount to cover the given amount.
 * @param {number} amount - amount to check coverage for.
 * @returns {boolean} true if the employee has enough remaining annual discount to cover the amount, false otherwise.
 */

Employee.prototype.hasDiscountCoverage = function (amount) {
    if (this.unlimitedDiscount) {
        return true;
    }

    return !!this.remainingAnnualDiscount && this.remainingAnnualDiscount >= amount;
};

/**
 * @description Check if the employee has invalid allowance usage (negative or exceeding allowance).
 * @returns {boolean} true if the employee has invalid allowance usage, false otherwise.
 */

Employee.prototype.hasInvalidAllowanceUsage = function () {
    return this.remainingAnnualDiscount < 0 || this.remainingAnnualDiscount > this.annualDiscountAllowance;
};

/**
 * @description Set a new country code for the employee and reset annual discount usage.
 * If the new country code is the same as the current one, no action is taken.
 *
 * @param {string} newCountryCode - new country code to set.
 * @returns {void}
 *
 * @throws {Error} if the new country code is empty.
 */

Employee.prototype.setCountryCode = function (newCountryCode) {
    if (empty(newCountryCode)) {
        throw new Error('Invalid argument: country code must be a non-empty string.');
    }

    if (this.countryCode !== newCountryCode) {
        this.apiEmployee.custom.countryCode = newCountryCode;
        this.resetAnnualDiscountUsage();
    }
};

/**
 * @description Get the string representation of the Employee instance.
 *
 * @returns {string} string representation of the Employee instance.
 */
Employee.prototype.toString = function () {
    return `Employee(ID: ${this.ID}, customerNumber: ${this.customerNumber}, zipCode: ${this.zipCode}, ` +
        `countryCode: ${this.countryCode}, companyID: ${this.companyID}, ` +
        `discountGroup: ${this.discountGroup}, annualDiscountAllowance: ${this.annualDiscountAllowance}, ` +
        `annualDiscountUsage: ${this.annualDiscountUsage}, unlimitedDiscount: ${this.unlimitedDiscount})`;
};

module.exports = Employee;

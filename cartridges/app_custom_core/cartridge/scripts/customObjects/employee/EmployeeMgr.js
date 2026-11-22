'use strict';

const Employee = require('*/cartridge/scripts/customObjects/employee/Employee');
const Logger = require('dw/system/Logger');
const CustomObjectMgr = require('dw/object/CustomObjectMgr');
const ES6Iterator = require('*/cartridge/scripts/customObjects/ES6Iterator');
const CustomPreference = require('cartridge/scripts/helpers/customPreference');

/**
 *  @module EmployeeMgr
 *  @description Provide methods to create, remove, and retrieve custom objects of type 'Employee'.
 */
const EmployeeMgr = (function () {
    /**
     * @description Get the annual discount allowance for an employee based on their discount group and hiring country.
     *
     * @param {string} countryCode - country code of employment.
     * @param {string} discountGroup - discount group the employee belongs to.
     *
     * @returns {number|string} annual discount allowance for the employee.
     */
    const getAnnualDiscountAllowance = function (countryCode, discountGroup) {
        if (empty(countryCode) || empty(discountGroup)) {
            return 0;
        }

        const employeeAllowanceMap = require('util/sitepref').getJSONValue('employeeDiscountAllowanceMap');
        const discountGroupAllowances = (employeeAllowanceMap && employeeAllowanceMap[countryCode]) || {};
        const discountAllowance = discountGroupAllowances[discountGroup];

        return parseFloat(discountAllowance) || 0;
    };

    /**
     * Create a new employee CustomObject with the given ID.
     *
     * @param {object} params - parameters object
     * @param {string} params.ID - employee ID
     * @param {string} params.countryCode - country code of employment
     * @param {string} params.zipCode - zip code
     * @param {string} params.discountGroup - discount group the employee belongs to
     * @param {string} [params.companyID] - company ID
     * @param {number} [params.customAnnualDiscountAllowance] - customized annual discount allowance
     * @param {boolean} [params.unlimitedDiscount] - whether the employee has unlimited discount
     *
     * @returns {Employee} instance of newly created employee
     *
     * @throws {Error} if the employee already exists or if the ID is invalid
     * @throws {Error} if invalid arguments are provided
     * @throws {Error} if the CustomObject creation fails
     */ 
    const createEmployee = function ({
        ID,
        countryCode,
        customAnnualDiscountAllowance,
        companyID,
        zipCode,
        discountGroup,
        unlimitedDiscount
    }) {
        if (empty(ID)) {
            throw new Error('Invalid argument: ID must be a non-empty string.');
        }

        if (empty(discountGroup)) {
            throw new Error('Invalid argument: discountGroup must be a non-empty string.');
        }

        if (empty(countryCode)) {
            throw new Error('Invalid argument: countryCode must be a non-empty string.');
        }

        if (empty(zipCode)) {
            throw new Error('Invalid argument: zipCode must be a non-empty string.');
        }

        if (!empty(companyID) && ID.indexOf(companyID + '-')) {
            ID = companyID + '-' + ID;
        }

        let newCO;

        const categoryConfig = CustomPreference.employeeBenifitsConfigs;
        const benifitDetailsByCategory = {};
        if (CustomPreference.isEmployeeBenifitsActive && categoryConfig) {
            Object.keys(categoryConfig).forEach(function (category) {
                // we could use site specific site Custom prefernce value, but I write below logic considering current structure 
                const allowance = parseFloat(categoryConfig[category][countryCode]);
                if (!isNaN(allowance) && allowance >= 0) {
                    benifitDetailsByCategory[category] = {
                        isActive: true,
                        annualDiscountAllowance: allowance,
                        discountUsage: 0
                    };
                }
            });
        }

        const Transaction = require('dw/system/Transaction');
        try {
            Transaction.wrap(function () {
                newCO = CustomObjectMgr.createCustomObject('Employee', ID);

                newCO.custom.ID = ID;
                newCO.custom.countryCode = countryCode;
                newCO.custom.companyID = companyID || '';
                newCO.custom.zipCode = zipCode;
                newCO.custom.companyBenifits = {
                    discountDetails: {
                        discountGroup: discountGroup,
                        customAnnualDiscountAllowance: unlimitedDiscount ? 0 : customAnnualDiscountAllowance || 0,
                        annualDiscountUsage: 0,
                        unlimitedDiscount: !!unlimitedDiscount,
                        lastAllowanceReset: new Date().toISOString()
                    },
                    benifitDetailsByCategory: benifitDetailsByCategory
                };
            });

            return new Employee(newCO);
        } catch (error) {
            throw new Error('Failed to create employee CustomObject: ' + error.message);
        }
    };

    /**
     * Update an existing employee CustomObject.
     *
     * @param {Employee} employee - instance of Employee to update
     * @param {object} attributes - object containing updated values
     * @param {string} attributes.zipCode - new zip code
     * @param {string} attributes.discountGroup - new discount group
     * @param {number} attributes.customAnnualDiscountAllowance - new custom annual discount allowance
     * @param {boolean} attributes.unlimitedDiscount - new unlimited discount flag
     * @param {string} attributes.countryCode - new country code
     *
     * @returns {void}
     *
     * @throws {Error} if the update fails
     */

    const updateEmployee = function (
        employee,
        { zipCode, discountGroup, customAnnualDiscountAllowance, unlimitedDiscount, countryCode }
    ) {
        if (!(employee instanceof Employee)) {
            throw new Error('Invalid argument: employee must be a valid Employee instance.');
        }

        const Transaction = require('dw/system/Transaction');

        try {
            Transaction.wrap(function () {
                employee.zipCode = zipCode;
                employee.discountGroup = discountGroup;
                employee.customAnnualDiscountAllowance = customAnnualDiscountAllowance || 0;
                employee.unlimitedDiscount = !!unlimitedDiscount;
                employee.setCountryCode(countryCode);
            });

            return employee;
        } catch (error) {
            throw new Error('Failed to update employee CustomObject: ' + error.message);
        }
    };

    /**
     * @description Retrieve an employee CustomObject by its ID.
     *
     * @param {string} ID - ID of the employee to search for.
     *
     * @returns {Employee|null} - instance of Employee, or null if not found.
     */
    const getEmployeeById = function (ID, companyID) {
        if (empty(ID)) {
            return null;
        }

        if (!empty(companyID) && ID.indexOf(companyID + '-') !== 0) {
            ID = companyID + '-' + ID;
        }

        try {
            const employeeCO = CustomObjectMgr.getCustomObject('Employee', ID);

            if (!employeeCO) {
                return null;
            }

            return new Employee(employeeCO);
        } catch (error) {
            Logger.error('Failed to retrieve employee CustomObject: ' + error.message);

            return null;
        }
    };

    /**
     * @description Retrieve an employee CustomObject by its customer number.
     *
     * @param {string} customerNumber - number of the customer to search for.
     *
     * @returns {Employee|null} - instance of Employee, or null if not found.
     *
     * @throws {Error} - if an error occurs during the retrieval process.
     */
    const getEmployeeByCustomerNumber = function (customerNumber) {
        if (empty(customerNumber)) {
            return null;
        }

        try {
            const employeeCO = CustomObjectMgr.queryCustomObject(
                'Employee',
                'custom.customerNumber = {0}',
                customerNumber
            );

            return employeeCO ? new Employee(employeeCO) : null;
        } catch (error) {
            Logger.error('Failed to retrieve employee by customer number: ' + error.message);

            return null;
        }
    };

    /**
     * Create an employee CustomObject from legacy attributes of migrated customer profile.
     *
     * @param {dw.customer.Profile} profile - customer profile to create the employee from
     *
     * @returns {Employee|null} instance of newly created employee
     *
     * @throws {Error} if call to create employee fails
     * @throws {Error} if profile and employee cannot be linked
     */
    const createEmployeeFromLegacyProfile = function (profile) {
        const isLegacyEmployee = profile && profile.custom.employeeGroup;

        if (!isLegacyEmployee) {
            return null;
        }

        const accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
        const Transaction = require('dw/system/Transaction');

        // migrated ex-employees have non-empty employee legacy fields and isEmployee flag set to false
        if (!profile.custom.isEmployee) {
            Transaction.wrap(function () {
                accountHelpers.clearEmployeeLegacyAttributes(profile);
                profile.custom.employeeNumber = null;
            });

            return null;
        }

        const employeeNumber = profile.custom.employeeNumber;
        let employee = getEmployeeById(employeeNumber);

        try {
            Transaction.wrap(() => {
                const countryCode = profile.custom.employeeShippingCountry;
                const discountGroup = profile.custom.employeeGroup;
                const legacyAnnualAllowance = profile.custom.totalDiscountLimit;
                const standardAnnualDiscountAllowance = EmployeeMgr.getAnnualDiscountAllowance(
                    countryCode,
                    discountGroup
                );
                const customAnnualDiscountAllowance =
                    legacyAnnualAllowance !== standardAnnualDiscountAllowance ? legacyAnnualAllowance : null;
                const zipCode = profile.custom.employeeZipCode;
                const companyID = profile.custom.companyID;
                const unlimitedDiscount = profile.custom.unlimitedTotalDiscount;
                const discountUsage = profile.custom.totalDiscountLimit - profile.custom.remainingDiscountLimit;

                // existing employees created from import job are overwritten by those created from legacy profile
                // to ensure the editable fields (such as allowance usage) are up to date
                if (employee) {
                    EmployeeMgr.removeEmployee(employee);
                }

                employee = EmployeeMgr.createEmployee({
                    ID: employeeNumber,
                    discountGroup: discountGroup,
                    zipCode: zipCode,
                    customAnnualDiscountAllowance: customAnnualDiscountAllowance,
                    countryCode: countryCode,
                    companyID: companyID,
                    unlimitedDiscount: unlimitedDiscount
                });

                employee.increaseAnnualDiscountUsage(discountUsage);
                employee.setCustomer(profile);

                accountHelpers.clearEmployeeLegacyAttributes(profile);
            });

            return employee;
        } catch (error) {
            throw new Error(
                'Failed to create employee ' + profile.custom.employeeNumber + ' from profile with customer number ' +
                    profile.customerNo + ': ' + error.message
            );
        }
    };

    /**
     * @description Update employee with given parameters or create a new one if it does not exist.
     *
     * @param {object} params - parameters object
     * @param {string} params.ID - employee ID
     * @param {string} params.countryCode - country code of employment
     * @param {number} params.customAnnualDiscountAllowance - customized annual discount allowance
     * @param {string} [params.companyID] - company ID
     * @param {string} params.zipCode - zip code
     * @param {string} params.discountGroup - discount group the employee belongs to
     * @param {boolean} params.unlimitedDiscount - whether the employee has unlimited discount
     *
     * @returns {Employee} instance of saved employee
     *
     * @throws {Error} if the employee cannot be saved
     *
     */
    const saveEmployee = function ({
        ID,
        countryCode,
        customAnnualDiscountAllowance,
        companyID,
        zipCode,
        discountGroup,
        unlimitedDiscount
    }) {
        const existingEmployee = getEmployeeById(ID, companyID);

        if (existingEmployee) {
            return updateEmployee(existingEmployee, {
                customAnnualDiscountAllowance: customAnnualDiscountAllowance,
                zipCode: zipCode,
                discountGroup: discountGroup,
                unlimitedDiscount: unlimitedDiscount,
                countryCode: countryCode
            });
        } else {
            return createEmployee({
                ID: ID,
                discountGroup: discountGroup,
                zipCode: zipCode,
                customAnnualDiscountAllowance: customAnnualDiscountAllowance,
                countryCode: countryCode,
                companyID: companyID,
                unlimitedDiscount: unlimitedDiscount
            });
        }
    };

    /**
     * @description Remove an employee CustomObject.
     * @param {Employee} employee - instance of Employee to remove.
     * @returns {void}
     * @throws {Error} - if the employee does not exist or if the removal fails.
     */
    const removeEmployee = function (employee) {
        if (!(employee instanceof Employee)) {
            throw new Error('Invalid argument: employee must be a valid Employee instance.');
        }

        try {
            const Transaction = require('dw/system/Transaction');

            Transaction.wrap(function () {
                employee.resetCustomer();
                CustomObjectMgr.remove(employee.apiEmployee);
            });
        } catch (error) {
            throw new Error('Failed to remove employee CustomObject: ' + error.message);
        }
    };

    /**
     * @description Remove an employee CustomObject by its ID.
     *
     * @param {string} ID - ID of the employee to remove.
     *
     * @returns {void}
     *
     * @throws {Error} - if the employee does not exist or if the removal fails.
     */
    const removeEmployeeById = function (ID) {
        removeEmployee(getEmployeeById(ID));
    };

    /**
     * @description Query employees based on a given query string and parameters.
     *
     * @param {string} query - query string to filter employees.
     * @param {string|null} [sortString] - optional sort string to order the results.
     * @param {Array} [params] - optional parameters for the query.
     * @returns {ES6Iterator} - iterator that yields Employee instances.
     * @throws {Error} - if the query fails or if the parameters are invalid.
     */
    const queryEmployees = function (query, sortString, params) {
        if (!query) {
            return getAllEmployees();
        }

        const employeeCOs = CustomObjectMgr.queryCustomObjects('Employee', query, sortString || 'custom.ID asc', params);

        return new ES6Iterator(employeeCOs, Employee);
    };

    /**
     * @description Get all employees as an iterator.
     *
     * @returns {ES6Iterator} - iterator that yields Employee instances.
     * @throws {Error} - if the retrieval fails.
     */
    const getAllEmployees = function () {
        const employeeCOs = CustomObjectMgr.getAllCustomObjects('Employee');

        return new ES6Iterator(employeeCOs, Employee);
    };

    return {
        createEmployee: createEmployee,
        updateEmployee: updateEmployee,
        createEmployeeFromLegacyProfile: createEmployeeFromLegacyProfile,
        getEmployeeById: getEmployeeById,
        getAnnualDiscountAllowance: getAnnualDiscountAllowance,
        getEmployeeByCustomerNumber: getEmployeeByCustomerNumber,
        saveEmployee: saveEmployee,
        removeEmployeeById: removeEmployeeById,
        removeEmployee: removeEmployee,
        queryEmployees: queryEmployees,
        searchEmployees: queryEmployees,
        getAllEmployees: getAllEmployees
    };
})();

module.exports = EmployeeMgr;

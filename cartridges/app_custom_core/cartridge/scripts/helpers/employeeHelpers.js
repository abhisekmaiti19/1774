/* eslint-disable max-len */

'use strict';

/**
 * @memberof app_custom_core
 * @category app_custom_core
 * @subcategory helpers
 * @module employeeHelpers
 * @description Helpers for the employee functionality
 */

const employeeHelpers = {};

/**
 * @description Get active employee (session-based) promotions.
 * @returns {dw.campaign.PromotionPlan} plan of active promotions
 * @throws {Error} if the campaign is not found, as it should be running continuously
 */

employeeHelpers.getActivePromotions = () => {
    const PromotionMgr = require('dw/campaign/PromotionMgr');
    const Resource = require('dw/web/Resource');
    const campaignID = Resource.msg('campaign.id.employees', 'merchantTools', null);
    const campaign = PromotionMgr.getCampaign(campaignID);

    if (!campaign) {
        throw new Error("'Employee' campaign not found: please ensure it is active and scheduled continuously");
    }

    return PromotionMgr.getActiveCustomerPromotionsForCampaign(campaign, new Date(), new Date());
};

/**
 * @description Get active employee product promotions.
 * @returns {dw.util.Collection<dw.campaign.Promotion>} collection of active product promotions
 */

employeeHelpers.getActiveProductPromotions = () => employeeHelpers.getActivePromotions().getProductPromotions();

/**
 * @description Get active employee shipping promotions for qualified customers.
 * @returns {dw.util.Collection<dw.campaign.Promotion>} collection of active shipping promotions
 */

employeeHelpers.getActiveShippingPromotions = () => employeeHelpers.getActivePromotions().getShippingPromotions();

/**
 * @description Temporarily enforce that the current session qualifies as an employee session,
 * so that employee promotions become available when executing the callback function.
 * The original session state is restored afterwards.
 * The employee promotion a customer can potentially qualify for is needed, for example,
 * to determine the discount rate and the amount that would be required from the employee allowance (even if unaffordable).
 * @param {Function} callback - function to execute with temporarily enforced employee session
 * @returns {any} result of the callback function
 */

const temporarilyEnforceEmployeeAllowance = function (callback) {
    const Transaction = require('dw/system/Transaction');
    const hasEnoughAllowance = session.custom.hasEnoughAllowance;
    let result;

    Transaction.wrap(() => {
        session.custom.hasEnoughAllowance = true;

        result = callback();

        session.custom.hasEnoughAllowance = hasEnoughAllowance;
    });

    return result;
};

/**
 * @description Get the unique employee product promotion the current customer can qualify for, ignoring the allowance.
 * @returns {dw.campaign.Promotion | null} the unique promotion, or null if not an employee session
 * @throws {Error} if no or multiple promotions are found for the current employee session
 */

employeeHelpers.getActiveCustomerProductPromotion = function () {
    const hiringCountry = session.custom.hiringCountry;

    // not an employee session, can't determine promotion not even enforcing allowance
    if (empty(hiringCountry)) {
        return null;
    }

    const siteHelpers = require('*/cartridge/scripts/helpers/siteHelpers');
    const currentCountry = siteHelpers.getCurrentShopCountryCode();

    if (hiringCountry.toLowerCase() !== currentCountry.toLowerCase()) {
        return null;
    }

    const promotions = temporarilyEnforceEmployeeAllowance(
        employeeHelpers.getActiveProductPromotions
    );

    const companyID = session.custom.companyID || 'Birkenstock';

    if (empty(promotions)) {
        throw new Error('No employee product promotion found: please ensure employee promotion set up for country ['
            + session.custom.hiringCountry + '] and company [' + companyID + ']');
    }

    if (promotions.length > 1) {
        throw new Error('Multiple employee product promotions found for [' + session.custom.hiringCountry + '] and ['
            + companyID + ']: please ensure uniqueness of promotions an employee can qualify for');
    }

    return promotions[0];
};

/**
 * @description Get the discount rate for the employee product promotion (based on the current session).
 * @returns {number} retrieved discount rate, or 0 if none found in non-employee session
 * @throws {Error} if no or multiple promotions are found for the current employee session,
 * or if the found promotion has no valid discount rate
 */

employeeHelpers.getDiscountRate = () => {
    const promotion = employeeHelpers.getActiveCustomerProductPromotion();

    if (empty(promotion)) {
        // not an employee session
        return 0;
    }

    const discountRate = promotion.custom.discountRate;

    if (discountRate > 0) {
        return discountRate;
    }

    const hiringCountry = session.custom.hiringCountry;
    const companyID = session.custom.companyID || 'Birkenstock';

    throw new Error('Employee product promotion found for country [' + hiringCountry + '] and company ['
        + companyID + '], but it has no valid discount rate [' + discountRate + ']');
};

/**
 * @description Check if current customer qualifies for employee free shipping.
 * @returns {boolean} true if eligible for free shipping, false otherwise
 */

employeeHelpers.hasFreeShipping = () => {
    const promotions = employeeHelpers.getActiveShippingPromotions();

    return !empty(promotions);
};

/**
 * @description Validate employee custom object for referential integrity with customers.
 * Use a pre-built customerMap to avoid O(N^2) per-employee queries.
 *
 * @param {dw.object.CustomObject} employeeCO - employee custom object to validate
 * @param {dw.customer.Profile[]} profiles - array of profiles associated with the employee
 * @returns {string[]} error messages for violations, or empty array if integrity is intact
 */

employeeHelpers.validateReferentialIntegrity = function (employeeCO, profiles) {
    if (!employeeCO) {
        return [];
    }

    const errors = [];
    const employeeNumber = employeeCO.custom.ID;

    // MULTI_CUSTOMER: multiple customers reference the same employee number
    if (profiles.length > 1) {
        const customerNos = profiles.map(p => p.customerNo).join(', ');

        errors.push('MULTI_CUSTOMER: Employee [' + employeeNumber + '] is referenced by multiple customers [' + customerNos + ']');
    }

    const customerNumber = employeeCO.custom.customerNumber;

    if (empty(customerNumber)) {
        // CUSTOMER_UNLINKED: customer references this employee, but employee has empty customer number
        if (profiles.length === 1) {
            errors.push('CUSTOMER_UNLINKED: Employee [' + employeeNumber + '] has no customerNumber, but customer [' + profiles[0].customerNo + '] references this employee');
        }

        return errors;
    } 

    if (profiles.length === 1) {
        // CROSS_LINK: customer1 -> employee, but employee -> customer2
        if (profiles[0].customerNo !== customerNumber) {
            errors.push('CROSS_LINK: Employee [' + employeeNumber + '] has customerNumber [' + customerNumber + '], but the customer referencing the employee has customerNo [' + profiles[0].customerNo + ']');
        }
    }

    // ORPHAN_EMPLOYEE_LINK: employee has customer number, but no customer references it back
    if (profiles.length === 0) {
        errors.push('ORPHAN_EMPLOYEE_LINK: Employee [' + employeeNumber + '] has customerNumber [' + customerNumber + '], but no customer has employeeNumber matching this employee');
    }

    return errors;
};

/**
 * @description Validate employee custom object for discount allowance violations.
 *
 * @param {dw.object.CustomObject} employeeCO - employee custom object to validate
 * @returns {string[]} error messages for violations, or empty array if allowance is valid
 */

employeeHelpers.validateEmployeeCustomObjectAllowance = function (employeeCO) {
    const benefits = employeeCO.custom.companyBenifits;
    const details = (benefits && benefits.discountDetails) || {};

    if (details.unlimitedDiscount || !details.annualDiscountUsage) {
        return [];
    }

    if (details.annualDiscountUsage < 0) {
        return ['INVALID_ALLOWANCE: Employee [' + employeeCO.custom.ID + '] has negative annualDiscountUsage [' + details.annualDiscountUsage + ']'];
    }

    const EmployeeMgr = require('*/cartridge/scripts/customObjects/employee/EmployeeMgr');
    const annualDiscountAllowance = EmployeeMgr.getAnnualDiscountAllowance(
        employeeCO.custom.countryCode,
        details.discountGroup
    );

    if (details.annualDiscountUsage > annualDiscountAllowance) {
        return ['INVALID_ALLOWANCE: Employee [' + employeeCO.custom.ID + '] has annualDiscountUsage [' + details.annualDiscountUsage + '] exceeding allowance [' + annualDiscountAllowance + ']'];
    }

    return [];
};

/**
 * @description Validate an employee custom object for all integrity violation types.
 *
 * @param {dw.object.CustomObject} employeeCO - employee custom object
 * @param {dw.customer.Profile[]} profiles - array of profiles associated with the employee
 * @returns {string[]} error messages, or empty array if valid
 */

employeeHelpers.validateEmployeeCustomObject = function (employeeCO, profiles) {
    const integrityErrors = employeeHelpers.validateReferentialIntegrity(employeeCO, profiles);
    const allowanceErrors = employeeHelpers.validateEmployeeCustomObjectAllowance(employeeCO);

    return integrityErrors.concat(allowanceErrors);
};

/**
 * @description Build a Map<employeeNumber, Profile[]> from all customer profiles that reference an employee, to reduce complexity of integrity checks.
 *
 * @param {dw.util.SeekableIterator} profileIterator - iterator from CustomerMgr.searchProfiles
 * @returns {Map<string, dw.customer.Profile[]>} Map of employeeNumber to array of customer profiles referencing that employeeNumber
 */

function buildCustomerMap(profileIterator) {
    const customerMap = new Map();
    let profile;
    let employeeNumber;

    while (profileIterator.hasNext()) {
        profile = profileIterator.next();
        employeeNumber = profile.custom.employeeNumber;

        if (!customerMap.has(employeeNumber)) {
            customerMap.set(employeeNumber, []);
        }

        customerMap.get(employeeNumber).push(profile);
    }

    return customerMap;
}

/**
 * @description Validate that all customers referencing employees have a corresponding Employee CO (ORPHAN_CUSTOMER_LINK),
 * and that no customerNumber is referenced by multiple Employee COs (MULTI_EMPLOYEE).
 * 
 * @param {Map<string, dw.customer.Profile[]>} customerMap - Map of employeeNumber to array of customer profiles referencing that employeeNumber
 * @param {Set<string>} employeeNumbers - Set of all employeeNumbers that have a corresponding Employee CO
 * @returns {string[]} array of error messages, or empty array if no violations found
 */

employeeHelpers.validateCustomerToEmployeeLink = function (customerMap, employeeNumbers) {
    const errors = [];

    customerMap.forEach(function (profiles, empNum) {
        if (!employeeNumbers.has(empNum)) {
            profiles.forEach(function (profile) {
                errors.push('ORPHAN_CUSTOMER_LINK: Customer [' + profile.customerNo + '] has employeeNumber [' + empNum + '] but no Employee CO exists with that ID');
            });
        }
    });

    return errors;
};

/**
 * @description Validate that no customerNumber is referenced by multiple Employee COs.
 *
 * @param {Map<string, string[]>} customerNumberMap - Map of customerNumber to array of employee IDs referencing that customerNumber
 * @returns {string[]} array of error messages, or empty array if no violations found
 */

employeeHelpers.validateCustomerToEmployeeBijection = function (customerNumberMap) {
    const errors = [];

    customerNumberMap.forEach(function (employeeIDs, customerNo) {
        if (employeeIDs.length > 1) {
            errors.push('MULTI_EMPLOYEE: Customer [' + customerNo + '] is referenced by multiple Employee COs [' + employeeIDs.join(', ') + ']');
        }
    });

    return errors;
};

/**
 * @description Get all employee custom objects and validate them for referential integrity and allowance violations, returning an array of error messages.
 * 
 * @param {dw.util.SeekableIterator} employeeCOs - iterator of all Employee custom objects
 * @param {Map<string, dw.customer.Profile[]>} customerMap - Map of employeeNumber to array of customer profiles referencing that employeeNumber
 * @param {Set<string>} employeeNumbers - Set to be populated with all employeeNumbers that have a corresponding Employee CO
 * @param {Map<string, string[]>} customerNumberMap - Map to be populated with customerNumber to array of employee IDs referencing that customerNumber
 *
 * @returns {string[]} array of error messages, or empty array if no violations found
 */

employeeHelpers.validateEmployeeCustomObjects = function (employeeCOs, customerMap, employeeNumbers, customerNumberMap) {
    const employeeCOErrors = [];
    let employeeCO;
    let employeeErrors;
    let customerNumber;
    let employeeNumber;
    let profiles;

    while (employeeCOs.hasNext()) {
        employeeCO = employeeCOs.next();
        customerNumber = employeeCO.custom.customerNumber;
        employeeNumber = employeeCO.custom.ID;
        employeeNumbers.add(employeeNumber);

        // Track COs by customerNumber to enable MULTI_EMPLOYEE detection
        if (!empty(customerNumber)) {
            if (!customerNumberMap.has(customerNumber)) {
                customerNumberMap.set(customerNumber, []);
            }

            customerNumberMap.get(customerNumber).push(employeeNumber);
        }

        profiles = customerMap.get(employeeNumber) || [];

        employeeErrors = employeeHelpers.validateEmployeeCustomObject(employeeCO, profiles);

        if (employeeErrors.length > 0) {
            employeeCOErrors.push('Employee [' + employeeCO.custom.countryCode + '][' + employeeNumber + ']: ' + employeeErrors.join('; '));
        }
    }

    return employeeCOErrors;
}

/**
 * @description Get all employee custom objects and validate them, returning an array of errors.
 * Builds a customer map once (O(N)) instead of querying per employee (O(N²)).
 *
 * @returns {string[]} array of error messages, or empty array if no violations found
 */

employeeHelpers.getEmployeeErrors = function () {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');
    const CustomerMgr = require('dw/customer/CustomerMgr');
    const employeeCOs = CustomObjectMgr.getAllCustomObjects('Employee');
    const profileIterator = CustomerMgr.searchProfiles('custom.employeeNumber != null', null);

    try {
        const customerMap = buildCustomerMap(profileIterator);
        const employeeNumbers = new Set();
        const customerNumberMap = new Map();

        const employeeCOErrors = employeeHelpers.validateEmployeeCustomObjects(employeeCOs, customerMap, employeeNumbers, customerNumberMap);
        // MULTI_EMPLOYEE: multiple COs reference the same customerNumber
        const multiEmployeeErrors = employeeHelpers.validateCustomerToEmployeeBijection(customerNumberMap);
        // ORPHAN_CUSTOMER_LINK: customer has employeeNumber but no Employee CO matches
        const customerLinkErrors = employeeHelpers.validateCustomerToEmployeeLink(customerMap, employeeNumbers);

        return employeeCOErrors.concat(multiEmployeeErrors).concat(customerLinkErrors);
    } catch (error) {
        return ['Error validating employee custom objects: ' + error.message];
    } finally {
        employeeCOs.close();
        profileIterator.close();
    }
};

module.exports = employeeHelpers;

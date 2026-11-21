/* eslint-disable sonarjs/no-duplicate-string */

'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const Transaction = require('#mocks/dw/system/Transaction');
const Logger = require('#mocks/dw/system/Logger');

describe('app_custom_core/scripts/customObjects/employee/Employee', () => {
    let Employee;
    let mockCustomerMgr;
    let mockEmployeeMgr;
    let mockAccountHelpers;

    const createMockCustomer = (overrides = {}) => {
        return {
            customerNo: 'CUST123',
            profile: {
                firstName: 'John',
                lastName: 'Doe',
                custom: {}
            },
            ...overrides
        };
    };

    const createMockApiEmployee = (overrides = {}) => {
        const defaultEmployee = {
            type: 'Employee',
            custom: {
                ID: 'EMP001',
                customerNumber: 'CUST123',
                employeeZipCode: '12345',
                zipCode: '12345',
                countryCode: 'US',
                companyID: 'BIRK',
                discountGroup: 'EMPLOYEE',
                customAnnualDiscountAllowance: 1000,
                annualDiscountUsage: 250,
                unlimitedDiscount: false,
                active: true
            }
        };

        const mergedCustom = overrides.custom
            ? { ...defaultEmployee.custom, ...overrides.custom }
            : defaultEmployee.custom;

        const { custom, ...otherOverrides } = overrides;

        return {
            ...defaultEmployee,
            ...otherOverrides,
            custom: mergedCustom
        };
    };

    beforeEach(() => {
        const mockCustomer = createMockCustomer();

        mockCustomerMgr = {
            getCustomerByCustomerNumber: sinon.stub().returns(mockCustomer)
        };

        mockEmployeeMgr = {
            getEmployeeByCustomerNumber: sinon.stub(),
            getEmployeeById: sinon.stub(),
            createEmployee: sinon.stub(),
            getAnnualDiscountAllowance: sinon.stub()
        };

        mockAccountHelpers = {
            clearEmployeeLegacyAttributes: sinon.stub()
        };

        Employee = proxyquire('#cartridges/app_custom_core/cartridge/scripts/customObjects/employee/Employee', {
            'dw/customer/CustomerMgr': mockCustomerMgr,
            '*/cartridge/scripts/customObjects/employee/EmployeeMgr': mockEmployeeMgr,
            'dw/system/Transaction': Transaction,
            '*/cartridge/scripts/helpers/accountHelpers': mockAccountHelpers,
            'dw/system/Logger': Logger
        });
    });

    describe('Constructor', () => {
        it('should throw error if apiEmployee not provided', () => {
            assert.throws(() => {
                new Employee(null);
            }, 'Invalid constructor argument: apiEmployee must be a custom object of type "Employee". Received [null] instead.');
        });

        it('should throw error if apiEmployee type is not Employee custom object', () => {
            const invalidApiEmployee = {
                type: 'SomeOtherType',
                custom: {}
            };

            assert.throws(() => {
                new Employee(invalidApiEmployee);
            }, 'Invalid constructor argument: apiEmployee must be a custom object of type "Employee". Received [{"type":"SomeOtherType","custom":{}}] instead.');
        });

        it('should create an Employee instance from valid apiEmployee', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            assert.instanceOf(employee, Employee);
            assert.equal(employee.apiEmployee, mockApiEmployee);
        });
    });

    describe('.initialize()', () => {
        it('should not set customer if customerNumber is empty', () => {
            const mockApiEmployee = createMockApiEmployee({ custom: { customerNumber: '' } });
            const employee = new Employee(mockApiEmployee);

            assert.isUndefined(employee.customer);
            assert.equal(employee.customerNumber, '');
        });

        it('should clear customerNumber if not matching any existing customer', () => {
            const mockApiEmployee = createMockApiEmployee({ custom: { ID: 'EMP001', customerNumber: 'NON_EXISTENT' } });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(null);

            const employee = new Employee(mockApiEmployee);

            assert.isNull(employee.customerNumber);
            assert.isNull(employee.customer);
        });

        it('should set customer when customerNumber exists and customer retrieved', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = mockCustomerMgr.getCustomerByCustomerNumber(mockApiEmployee.custom.customerNumber);

            assert.equal(employee.customerNumber, 'CUST123');
            assert.equal(employee.customer, mockCustomer);
        });
    });

    describe('Property Getters', () => {
        it('should have all properties defined when they are set', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            assert.equal(employee.ID, 'EMP001');
            assert.equal(employee.customerNumber, 'CUST123');
            assert.equal(employee.zipCode, '12345');
            assert.equal(employee.countryCode, 'US');
            assert.equal(employee.companyID, 'BIRK');
            assert.equal(employee.discountGroup, 'EMPLOYEE');
            assert.equal(employee.annualDiscountAllowance, 1000);
            assert.equal(employee.annualDiscountUsage, 250);
            assert.isFalse(employee.unlimitedDiscount);
            assert.isDefined(employee.customer);
            assert.isTrue(employee.isRegistered);
            assert.isTrue(employee.isExternal);
        });

        it('should return default values for unset optional properties', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: undefined,
                    annualDiscountUsage: 0,
                    customAnnualDiscountAllowance: null,
                    unlimitedDiscount: false
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.equal(employee.annualDiscountUsage, 0);
            assert.isUndefined(employee.annualDiscountAllowance);
            assert.isFalse(employee.unlimitedDiscount);
            assert.isUndefined(employee.customer);
            assert.isUndefined(employee.customerNumber);
        });
    });

    describe('Property Setters', () => {
        it('should throw error when setting a read-only attribute', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.ID = 'NEW_ID';
            }, 'Cannot set read-only property ID on Employee instance.');
        });

        it('should update writable attribute', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            employee.discountGroup = 'PREMIUM';

            assert.equal(mockApiEmployee.custom.discountGroup, 'PREMIUM');
        });
    });

    describe('.increaseAnnualDiscountUsage()', () => {
        it('should throw error if amount is not a non-negative number', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.increaseAnnualDiscountUsage('invalid');
            }, 'Cannot increase annual allowance usage: amount must be a non-negative number');

            assert.throws(() => {
                employee.increaseAnnualDiscountUsage(-100);
            }, 'Cannot increase annual allowance usage: amount must be a non-negative number');
        });

        it('should not increase annual discount usage if employee has unlimited discount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 0,
                    unlimitedDiscount: true
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.doesNotThrow(() => {
                employee.increaseAnnualDiscountUsage(100);
            });

            assert.equal(employee.annualDiscountUsage, 0);
        });

        it('should throw error if employee has limited allowance and amount exceeds it', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000,
                    unlimitedDiscount: false
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.increaseAnnualDiscountUsage(800);
            }, 'Cannot increase annual allowance usage: allowance exceeded');
        });

        it('should increase annual discount usage successfully', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000,
                    unlimitedDiscount: false
                }
            });
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            const employee = new Employee(mockApiEmployee);

            assert.doesNotThrow(() => {
                employee.increaseAnnualDiscountUsage(100);
            });

            assert.equal(employee.annualDiscountUsage, 350);
            assert.equal(mockApiEmployee.custom.annualDiscountUsage, 350);
        });
    });

    describe('.decreaseAnnualDiscountUsage()', () => {
        it('should throw error if amount is not a non-negative number', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.decreaseAnnualDiscountUsage('invalid');
            }, 'Cannot decrease annual allowance usage: amount must be a non-negative number');

            assert.throws(() => {
                employee.decreaseAnnualDiscountUsage(-100);
            }, 'Cannot decrease annual allowance usage: amount must be a non-negative number');
        });

        it('should not decrease annual discount usage if employee has unlimited discount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 0,
                    unlimitedDiscount: true
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.doesNotThrow(() => {
                employee.decreaseAnnualDiscountUsage(100);
            });
            assert.equal(employee.annualDiscountUsage, 0);
        });

        it('should throw error if amount would result in negative annual discount usage', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.decreaseAnnualDiscountUsage(300);
            }, 'Cannot decrease annual discount usage: allowance below zero');
        });

        it('should decrease annual discount usage successfully', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            employee.customer = mockCustomer;

            assert.doesNotThrow(() => {
                employee.decreaseAnnualDiscountUsage(100);
            });

            assert.equal(employee.annualDiscountUsage, 150);
            assert.equal(mockApiEmployee.custom.annualDiscountUsage, 150);
        });
    });

    describe('.resetAnnualDiscountUsage()', () => {
        it('should decrease annual discount usage by zero when current usage is nullish', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: null,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            employee.customer = mockCustomer;

            assert.isUndefined(employee.lastAllowanceReset);

            assert.doesNotThrow(() => {
                employee.resetAnnualDiscountUsage();
            });

            assert.equal(employee.annualDiscountUsage, 0);
            assert.equal(mockApiEmployee.custom.annualDiscountUsage, 0);
            assert.isDefined(employee.lastAllowanceReset);
        });
        it('should decrease annual discount usage by defined current usage', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 500,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            employee.customer = mockCustomer;

            assert.isUndefined(employee.lastAllowanceReset);

            assert.doesNotThrow(() => {
                employee.resetAnnualDiscountUsage();
            });

            assert.equal(employee.annualDiscountUsage, 0);
            assert.equal(mockApiEmployee.custom.annualDiscountUsage, 0);
            assert.isDefined(employee.lastAllowanceReset);
        });
    });

    describe('.updateCustomAnnualDiscountAllowance()', () => {
        it('should throw error if new allowance is not a non-negative number', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.updateCustomAnnualDiscountAllowance('invalid');
            }, 'New allowance must be a non-negative number');

            assert.throws(() => {
                employee.updateCustomAnnualDiscountAllowance(-500);
            }, 'New allowance must be a non-negative number');
        });

        it('should update custom annual discount allowance successfully for registered employee', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            employee.customer = mockCustomer;

            assert.doesNotThrow(() => {
                employee.updateCustomAnnualDiscountAllowance(1500);
            });

            assert.equal(employee.annualDiscountAllowance, 1500);
            assert.equal(mockApiEmployee.custom.customAnnualDiscountAllowance, 1500);
        });

        it('should update annual discount allowance for unregistered employee', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: null,
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.doesNotThrow(() => {
                employee.updateCustomAnnualDiscountAllowance(2000);
            });

            assert.equal(employee.annualDiscountAllowance, 2000);
            assert.equal(mockApiEmployee.custom.customAnnualDiscountAllowance, 2000);
        });
    });

    describe('.remainingAnnualDiscount', () => {
        it('should return remaining discount allowance for registered employee', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({
                profile: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            });

            mockCustomerMgr.getCustomerByCustomerNumber.returns(mockCustomer);

            employee.customer = mockCustomer;

            assert.equal(employee.remainingAnnualDiscount, 750);
        });
        it('should return remaining discount allowance for unregistered employee', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: null,
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.equal(employee.remainingAnnualDiscount, 750);
        });
        // TODO: uncapped allowance

        it('should throw error if trying to set remaining annual discount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: {
                    customerNumber: 'CUST123',
                    annualDiscountUsage: 250,
                    customAnnualDiscountAllowance: 1000
                }
            });
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.remainingAnnualDiscount = 500;
            }, 'remainingAnnualDiscount is a read-only property derived from annualDiscountAllowance and annualDiscountUsage. ' +
                'You should rather update annualDiscountUsage by using increaseAnnualDiscountUsage and decreaseAnnualDiscountUsage methods.');
        });
    });

    describe('.isRegistered', () => {
        it('should return false if customerNumber is empty', () => {
            let mockApiEmployee;
            let employee;

            mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: '' }
            });
            employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.isRegistered);

            mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: null }
            });
            employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.isRegistered);

            mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: undefined }
            });
            employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.isRegistered);
        });

        it('should return true if employee is assigned a customer number', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: 'CUST123' }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.isRegistered);
        });
    });

    describe('.isExternal', () => {
        it('should return false if companyID is null', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { companyID: null }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.isExternal);
        });

        it('should return false if companyID is empty string', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { companyID: '' }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.isExternal);
        });

        it('should return true if companyID is set', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { companyID: 'PARTNER' }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.isExternal);
        });
    });

    describe('.toString()', () => {
        it('should return a string representation of the employee', () => {
            const ID = 'EMP001';
            const customerNumber = 'CUST123';
            const zipCode = '12345';
            const countryCode = 'US';
            const companyID = 'BIRK';
            const discountGroup = 'EMPLOYEE';
            const annualDiscountAllowance = 1000;
            const annualDiscountUsage = 250;
            const unlimitedDiscount = false;

            const mockApiEmployee = createMockApiEmployee({
                custom: {ID, customerNumber, zipCode, countryCode, companyID, discountGroup, customAnnualDiscountAllowance: annualDiscountAllowance, annualDiscountUsage, unlimitedDiscount}
            });
            const employee = new Employee(mockApiEmployee);

            const expectedString = `Employee(ID: ${ID}, customerNumber: ${customerNumber}, zipCode: ${zipCode}, countryCode: ${countryCode}, companyID: ${companyID}, discountGroup: ${discountGroup}, annualDiscountAllowance: ${annualDiscountAllowance}, annualDiscountUsage: ${annualDiscountUsage}, unlimitedDiscount: ${unlimitedDiscount})`;

            assert.equal(employee.toString(), expectedString);
        });
    });

    describe('.setCustomer()', () => {
        const createMockProfile = (overrides = {}) => {
            return {
                customerNo: 'CUST456',
                customer: {
                    customerNo: 'CUST456',
                    firstName: 'Jane'
                },
                custom: {
                    employeeNumber: ''
                },
                ...overrides
            };
        };

        it('should throw error if no profile provided', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.setCustomer(null);
            }, 'Invalid argument: profile must be provided.');
        });

        it('should throw error if non-legacy profile is already linked to an employee', () => {
            const customer = {
                customerNo: 'CUST456',
                firstName: 'Jane'
            }
            const employeeID = 'EMP001';
            const existingEmployeeID = 'EMP002';
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: '', ID: employeeID }
            });
            const employee = new Employee(mockApiEmployee);

            const mockProfile = createMockProfile({
                customerNo: customer.customerNo,
                customer: customer,
                custom: {
                    employeeNumber: existingEmployeeID,
                    isLegacyEmployee: false
                }
            });

            assert.throws(() => {
                employee.setCustomer(mockProfile);
            }, `Cannot set customer for employee ${employeeID}: profile is already linked to an employee with number ${existingEmployeeID}.`);
        });

        it('should throw error if employee is already registered as customer', () => {
            const customer1 = {
                customerNo: 'CUST123',
                firstName: 'John'
            };
            const customer2 = {
                customerNo: 'CUST456',
                firstName: 'Jane'
            };

            const employeeID = 'EMP001';
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: customer1.customerNo, customer: customer1, ID: employeeID }
            });
            const employee = new Employee(mockApiEmployee);

            const mockProfile = createMockProfile({
                customerNo: customer2.customerNo,
                customer: customer2
            });

            assert.throws(() => {
                employee.setCustomer(mockProfile);
            }, `Cannot set customer number ${customer2.customerNo} for employee ${employeeID}: employee is already registered with customer number ${customer1.customerNo}.`);
        });

        it('should throw error if customer number already linked to another employee', () => {
            const customer2 = {
                customerNo: 'CUST456',
                firstName: 'Jane'
            };
            const employeeID1 = 'EMP001';
            const employeeID2 = 'EMP002';
            const mockApiEmployee1 = createMockApiEmployee({
                custom: { customerNumber: '', ID: employeeID1 }
            });

            const employee1 = new Employee(mockApiEmployee1);

            const mockProfile = createMockProfile({
                customerNo: customer2.customerNo
            });

            mockEmployeeMgr.getEmployeeByCustomerNumber.withArgs(customer2.customerNo).returns(createMockApiEmployee({
                custom: { customerNumber: customer2.customerNo, customer: customer2, ID: employeeID2 }
            }));

            assert.throws(() => {
                employee1.setCustomer(mockProfile);
            }, `Cannot set customer number ${customer2.customerNo} for employee ${employeeID1}: customer number is already in use by another employee with ID ${employeeID2}.`);
        });

        it('should successfully set customer if non-legacy employee is not registered', () => {
            const customer = {
                customerNo: 'CUST456',
                firstName: 'Jane'
            };
            const employeeID = 'EMP001';
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: '', ID: employeeID }
            });
            const employee = new Employee(mockApiEmployee);

            const mockProfile = createMockProfile({
                customerNo: customer.customerNo,
                customer: customer,
                custom: {
                    isEmployee: false
                }
            });

            assert.isUndefined(employee.customer);

            mockEmployeeMgr.getEmployeeByCustomerNumber.returns(null);

            assert.doesNotThrow(() => {
                employee.setCustomer(mockProfile);
            });

            assert.isDefined(employee.customer);
            assert.equal(employee.customerNumber, customer.customerNo);
            assert.equal(mockApiEmployee.custom.customerNumber, customer.customerNo);
            assert.equal(mockProfile.custom.employeeNumber, employeeID);
        });

        it('should successfully set customer if legacy employee is not registered', () => {
            const customer = {
                customerNo: 'CUST456',
                firstName: 'Jane'
            };
            const employeeID = 'EMP001';
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: '', ID: employeeID }
            });
            const employee = new Employee(mockApiEmployee);

            const mockProfile = createMockProfile({
                customerNo: customer.customerNo,
                customer: customer,
                custom: {
                    isEmployee: true
                }
            });

            assert.isUndefined(employee.customer);

            mockEmployeeMgr.getEmployeeByCustomerNumber.returns(null);

            assert.doesNotThrow(() => {
                employee.setCustomer(mockProfile);
            });

            assert.isDefined(employee.customer);
            assert.equal(employee.customerNumber, customer.customerNo);
            assert.equal(mockApiEmployee.custom.customerNumber, customer.customerNo);
            assert.equal(mockProfile.custom.employeeNumber, employeeID);
        });
    });

    describe('.hasDiscountCoverage()', () => {
        it('should return true if has unlimited discount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: true }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.hasDiscountCoverage());
        });
        it('should return false if remaining annual discount is 0', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: false, annualDiscountUsage: 1000, customAnnualDiscountAllowance: 1000 }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.hasDiscountCoverage(1));
        });
        it('should return false if remaining annual discount is less than checked amount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: false, annualDiscountUsage: 250, customAnnualDiscountAllowance: 1000 }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isFalse(employee.hasDiscountCoverage(800));
        });
        it('should return true if remaining annual discount is equal to checked amount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: false, annualDiscountUsage: 250, customAnnualDiscountAllowance: 1000 }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.hasDiscountCoverage(750));
        });
        it('should return true if remaining annual discount is greater than checked amount', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: false, annualDiscountUsage: 250, customAnnualDiscountAllowance: 1000 }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.hasDiscountCoverage(500));
        });
        it('should return true if checked amount is 0', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { unlimitedDiscount: false, annualDiscountUsage: 250, customAnnualDiscountAllowance: 1000 }
            });
            const employee = new Employee(mockApiEmployee);

            assert.isTrue(employee.hasDiscountCoverage(0));
        });
    });

    describe('.resetCustomer()', () => {
        it('should skip if employee is not registered customer', () => {
            const spyWrap = sinon.spy(Transaction, 'wrap');
            const mockApiEmployee = createMockApiEmployee({ custom: { customerNumber: '' } });
            const employee = new Employee(mockApiEmployee);

            assert.isUndefined(employee.customer);
            assert.doesNotThrow(() => {
                employee.resetCustomer();
            });
            assert.isTrue(spyWrap.notCalled);
            spyWrap.restore();
        });
        it('should clear customer and employee number from profile', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { customerNumber: 'CUST123', ID: 'EMP001' }
            });
            const employee = new Employee(mockApiEmployee);
            const mockCustomer = createMockCustomer({profile: {custom: {employeeNumber: 'EMP001'}}});

            employee.customer = mockCustomer;

            assert.isDefined(employee.customer);
            assert.equal(employee.customer.profile.custom.employeeNumber, 'EMP001');

            employee.resetCustomer();

            assert.isNull(employee.customer);
            assert.isNull(mockApiEmployee.custom.customerNumber);
            assert.isTrue(mockAccountHelpers.clearEmployeeLegacyAttributes.calledOnceWith(mockCustomer.profile));
        });
    });

    describe('.hasInvalidAllowanceUsage()', () => {
        [true, false].forEach((unlimitedDiscount) => {
            describe(`when unlimitedDiscount is ${unlimitedDiscount}`, () => {
                it('should return true if remaining allowance is negative', () => {
                    const mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: 1200, customAnnualDiscountAllowance: 1000, unlimitedDiscount }
                    });
                    const employee = new Employee(mockApiEmployee);

                    assert.isTrue(employee.hasInvalidAllowanceUsage());
                });
                it('should return true if remaining allowance is greater than annualDiscountAllowance', () => {
                    const mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: -200, customAnnualDiscountAllowance: 1000, unlimitedDiscount }
                    });
                    const employee = new Employee(mockApiEmployee);

                    assert.isTrue(employee.hasInvalidAllowanceUsage());
                });
                it('should return false if remaining allowance is equal to annual allowance', () => {
                    const mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: 1000, customAnnualDiscountAllowance: 1000 }
                    });
                    const employee = new Employee(mockApiEmployee);

                    assert.isFalse(employee.hasInvalidAllowanceUsage());
                });
                it('should return false if remaining allowance is less than annual allowance', () => {
                    const mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: 800, customAnnualDiscountAllowance: 1000 }
                    });
                    const employee = new Employee(mockApiEmployee);

                    assert.isFalse(employee.hasInvalidAllowanceUsage());
                });
                it('should return false if allowance usage is nullish', () => {
                    let mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: null, customAnnualDiscountAllowance: 1000 }
                    });
                    let employee = new Employee(mockApiEmployee);

                    assert.isFalse(employee.hasInvalidAllowanceUsage());

                    mockApiEmployee = createMockApiEmployee({
                        custom: { annualDiscountUsage: undefined, customAnnualDiscountAllowance: 1000 }
                    });
                    employee = new Employee(mockApiEmployee);

                    assert.isFalse(employee.hasInvalidAllowanceUsage());
                });
            });
        });
    });

    describe('.setCountryCode()', () => {
        it('should throw error if country code is empty', () => {
            const mockApiEmployee = createMockApiEmployee();
            const employee = new Employee(mockApiEmployee);

            assert.throws(() => {
                employee.setCountryCode('');
            }, 'Invalid argument: country code must be a non-empty string.');
        });

        it('should skip if country code is the same as current', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { countryCode: 'DE' }
            });
            const employee = new Employee(mockApiEmployee);

            employee.resetAnnualDiscountUsage = sinon.spy();

            assert.doesNotThrow(() => {
                employee.setCountryCode('DE');
            });

            assert.isTrue(employee.resetAnnualDiscountUsage.notCalled);
        });

        it('should update country code and reset annual discount usage', () => {
            const mockApiEmployee = createMockApiEmployee({
                custom: { countryCode: 'DE' }
            });
            const employee = new Employee(mockApiEmployee);

            employee.resetAnnualDiscountUsage = sinon.spy();

            assert.doesNotThrow(() => {
                employee.setCountryCode('IT');
            });

            assert.equal(mockApiEmployee.custom.countryCode, 'IT');
            assert.isTrue(employee.resetAnnualDiscountUsage.calledOnce);
        });
    });
});

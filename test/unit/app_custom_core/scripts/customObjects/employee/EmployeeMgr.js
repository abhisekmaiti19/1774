/* eslint-disable sonarjs/no-duplicate-string */

'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const mockLogger = require('#mocks/dw/system/Logger');
const mockCustomObjectMgr = require('#mocks/dw/object/CustomObjectMgr');
const mockTransaction = require('#mocks/dw/system/Transaction');
const mockEmployee = require('#mocks/app_custom_core/scripts/customObjects/employee/Employee');
const ES6Iterator = require('#mocks/app_custom_core/scripts/customObjects/ES6Iterator');
const CustomPreference = require('#mocks/cartridge/scripts/helpers/customPreference');

describe('app_custom_core/scripts/customObjects/employee/EmployeeMgr', () => {
    let EmployeeMgr;
    let mockCustomObject;
    let sitepref;
    let mockAccountHelpers;

    beforeEach(() => {
        mockCustomObject = {
            custom: {
                ID: '',
                countryCode: '',
                customAnnualDiscountAllowance: 0,
                companyID: '',
                zipCode: '',
                discountGroup: '',
                unlimitedDiscount: false
            }
        };

        sitepref = {
            getJSONValue: sinon.stub()
        };

        sinon.stub(mockCustomObjectMgr, 'createCustomObject').returns(mockCustomObject);
        sinon.stub(mockCustomObjectMgr, 'getCustomObject').returns(null);
        sinon.stub(mockCustomObjectMgr, 'queryCustomObjects');
        sinon.stub(mockCustomObjectMgr, 'queryCustomObject');
        sinon.stub(mockCustomObjectMgr, 'getAllCustomObjects');
        sinon.stub(mockCustomObjectMgr, 'remove');
        sinon.stub(mockTransaction, 'wrap').callsFake((callback) => {
            callback();
        });
        sinon.stub(mockEmployee.prototype, 'initialize').callsFake(() => {
            this.customObject = mockCustomObject;
        });
        mockAccountHelpers = {
            clearEmployeeLegacyAttributes: sinon.stub()
        };

        EmployeeMgr = proxyquire('#cartridges/app_custom_core/cartridge/scripts/customObjects/employee/EmployeeMgr', {
            'dw/object/CustomObjectMgr': mockCustomObjectMgr,
            'dw/system/Transaction': mockTransaction,
            '*/cartridge/scripts/customObjects/employee/Employee': mockEmployee,
            'dw/system/Logger': mockLogger,
            'util/sitepref': sitepref,
            '*/cartridge/scripts/customObjects/ES6Iterator': ES6Iterator,
            '*/cartridge/scripts/helpers/accountHelpers': mockAccountHelpers,
            'dw/customer/CustomerMgr': {
                getProfile: sinon.stub().returns({
                    custom: {
                        employeeNumber: 'EMP001'
                    }
                })
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('.createEmployee()', () => {
        it('should throw error for empty ID', () => {
            assert.throws(() => {
                EmployeeMgr.createEmployee({
                    ID: '',
                    countryCode: 'US',
                    customAnnualDiscountAllowance: 1000
                });
            }, 'Invalid argument: ID must be a non-empty string.');

            assert.throws(() => {
                EmployeeMgr.createEmployee({
                    ID: null,
                    customAnnualDiscountAllowance: 1000
                });
            }, 'Invalid argument: ID must be a non-empty string.');
        });

        it('should throw error if empty discountGroup', () => {
            assert.throws(() => {
                EmployeeMgr.createEmployee({
                    ID: 'TEST123',
                    countryCode: 'US',
                    zipCode: '12345'
                });
            }, 'Invalid argument: discountGroup must be a non-empty string.');
        });

        it('should throw error if empty countryCode', () => {
            assert.throws(() => {
                EmployeeMgr.createEmployee({
                    ID: 'TEST123',
                    countryCode: '',
                    zipCode: '12345',
                    discountGroup: 'STANDARD'
                });
            }, 'Invalid argument: countryCode must be a non-empty string.');
        });

        it('should throw error if empty zipCode', () => {
            assert.throws(() => {
                EmployeeMgr.createEmployee({
                    ID: 'TEST123',
                    countryCode: 'US',
                    zipCode: '',
                    discountGroup: 'STANDARD'
                });
            }, 'Invalid argument: zipCode must be a non-empty string.');
        });

        it('should not prefix ID if companyID not provided', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.equal(result.apiEmployee.custom.ID, 'TEST123');
        });

        it('should prefix ID with provided companyID if exists', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                companyID: 'ACME',
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.equal(result.apiEmployee.custom.ID, 'ACME-TEST123');
        });

        it('should not prefix with company ID if ID already prefixed', () => {
            const params = {
                ID: 'ACME-TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                companyID: 'ACME',
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.equal(result.apiEmployee.custom.ID, 'ACME-TEST123');
        });

        it('should throw error if Employee instancing fails on created custom object', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            mockEmployee.prototype.initialize.throws(new Error('Failed to initialize Employee'));

            assert.throws(() => {
                EmployeeMgr.createEmployee(params);
            }, 'Failed to create employee CustomObject: Failed to initialize Employee');
        });

        it('should create external employee when companyID is provided', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                companyID: 'ACME',
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.isDefined(result.apiEmployee.custom.lastAllowanceReset);
            assert.deepEqual(result.apiEmployee.custom, {
                ID: 'ACME-TEST123',
                countryCode: 'US',
                annualDiscountUsage: 0,
                customAnnualDiscountAllowance: 1000,
                companyID: 'ACME',
                zipCode: '12345',
                discountGroup: 'STANDARD',
                unlimitedDiscount: false,
                lastAllowanceReset: result.apiEmployee.custom.lastAllowanceReset // skip actual date check
            });
        });

        it('should create internal employee when no companyID is provided', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                companyID: '',
                zipCode: '12345',
                discountGroup: 'STANDARD'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.isDefined(result.apiEmployee.custom.lastAllowanceReset);
            assert.deepEqual(result.apiEmployee.custom, {
                ID: 'TEST123',
                countryCode: 'US',
                annualDiscountUsage: 0,
                customAnnualDiscountAllowance: 1000,
                companyID: '',
                zipCode: '12345',
                discountGroup: 'STANDARD',
                unlimitedDiscount: false,
                lastAllowanceReset: result.apiEmployee.custom.lastAllowanceReset // skip actual date check
            });
        });

        it('should handle unlimited discount employee creation', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                discountGroup: 'STANDARD',
                unlimitedDiscount: true,
                zipCode: '12345'
            };

            const result = EmployeeMgr.createEmployee(params);

            assert.isDefined(result.apiEmployee.custom.lastAllowanceReset);
            assert.deepEqual(result.apiEmployee.custom, {
                ID: 'TEST123',
                countryCode: 'US',
                discountGroup: 'STANDARD',
                companyID: '',
                annualDiscountUsage: 0,
                customAnnualDiscountAllowance: 0,
                unlimitedDiscount: true,
                zipCode: '12345',
                lastAllowanceReset: result.apiEmployee.custom.lastAllowanceReset // skip actual date check
            });
        });

        it('should throw error when CustomObject creation fails', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                discountGroup: 'STANDARD',
                customAnnualDiscountAllowance: 1000,
                zipCode: '12345'
            };

            mockTransaction.wrap.throws(new Error('Database connection failed'));

            assert.throws(() => {
                EmployeeMgr.createEmployee(params);
            }, 'Failed to create employee CustomObject: Database connection failed');
        });
    });

    describe('.updateEmployee()', () => {
        it('should throw error if no employee provided', () => {
            assert.throws(() => {
                EmployeeMgr.updateEmployee(null, {
                    countryCode: 'DE',
                    zipCode: '12345',
                    discountGroup: 'STANDARD'
                });
            }, 'Invalid argument: employee must be a valid Employee instance.');
        });

        it('should throw error if employee is not an instance of Employee', () => {
            assert.throws(() => {
                EmployeeMgr.updateEmployee({}, {
                    countryCode: 'DE',
                    zipCode: '12345',
                    discountGroup: 'STANDARD'
                });
            }, 'Invalid argument: employee must be a valid Employee instance.');
        });

        it('should throw error when setting invalid arguments', () => {
            const employee = new mockEmployee();

            employee.setCountryCode = sinon.stub().throws(
                new Error('Invalid argument: country code must be a non-empty string.')
            );

            assert.throws(() => {
                EmployeeMgr.updateEmployee(employee, {
                    countryCode: '',
                    zipCode: '12345',
                    discountGroup: 'STANDARD'
                });
            }, 'Failed to update employee CustomObject: Invalid argument: country code must be a non-empty string.');
        });

        it('should update employee attributes successfully', () => {
            const employee = new mockEmployee();

            employee.apiEmployee = {
                custom: {
                    ID: 'TEST123',
                    countryCode: 'DE',
                    zipCode: '54321',
                    discountGroup: 'PREMIUM',
                    customAnnualDiscountAllowance: 2000,
                    unlimitedDiscount: false
                }
            };

            EmployeeMgr.updateEmployee(employee, {
                countryCode: 'IT',
                zipCode: '12345',
                discountGroup: 'STANDARD',
                customAnnualDiscountAllowance: 1500,
                unlimitedDiscount: true
            });

            assert.equal(employee.countryCode, 'IT');
            assert.equal(employee.zipCode, '12345');
            assert.equal(employee.discountGroup, 'STANDARD');
            assert.equal(employee.customAnnualDiscountAllowance, 1500);
            assert.isTrue(employee.unlimitedDiscount);
        });

        it('should update employee with defaults when params missing', () => {
            const employee = new mockEmployee();

            employee.apiEmployee = {
                custom: {
                    ID: 'TEST123',
                    countryCode: 'DE',
                    zipCode: '54321',
                    discountGroup: 'PREMIUM',
                    customAnnualDiscountAllowance: 2000,
                    unlimitedDiscount: true
                }
            };

            EmployeeMgr.updateEmployee(employee, {
                countryCode: 'IT',
                zipCode: '12345',
            });

            assert.equal(employee.customAnnualDiscountAllowance, 0);
            assert.isFalse(employee.unlimitedDiscount);
        });
    });

    describe('.createEmployeeFromLegacyProfile()', () => {
        it('should skip if no profile provided', () => {
            const getEmployeeByIdSpy = sinon.spy(EmployeeMgr, 'getEmployeeById');
            const result = EmployeeMgr.createEmployeeFromLegacyProfile(null);

            assert.isNull(result);
            assert.isFalse(getEmployeeByIdSpy.called);
            sinon.restore();
        });
        it('should skip if profile has no legacy employee fields', () => {
            const profile = {
                custom: {
                    employeeNumber: '',
                    employeeGroup: ''
                }
            };

            const getEmployeeByIdSpy = sinon.spy(EmployeeMgr, 'getEmployeeById');
            const result = EmployeeMgr.createEmployeeFromLegacyProfile(profile);

            assert.isNull(result);
            assert.isFalse(getEmployeeByIdSpy.called);
            sinon.restore();
        });
        it('should not created custom object but only clear legacy attributes if ex-employee', () => {
            const profile = {
                custom: {
                    employeeNumber: 'EMP001',
                    employeeGroup: 'STANDARD',
                    isEmployee: false // legacy employee when this is false but other fields are set
                }
            };

            const getEmployeeByIdSpy = sinon.spy(EmployeeMgr, 'getEmployeeById');
            const result = EmployeeMgr.createEmployeeFromLegacyProfile(profile);

            assert.isNull(result);
            assert.isFalse(getEmployeeByIdSpy.called);
            assert.isNull(profile.custom.employeeNumber);
        });
        it('should throw if employee creation fails', () => {
            sinon.stub(EmployeeMgr, 'createEmployee').throws(new Error('Failed to create employee'));
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };

            assert.throws(() => {
                EmployeeMgr.createEmployeeFromLegacyProfile(profile);
            }, `Failed to create employee ${profile.custom.employeeNumber} from profile with customer number ${profile.customerNo}: Failed to create employee`);
            sinon.restore();
        });
        it('should throw if created employee annual discount usage increase fails', () => {
            const employee = {
                setCustomer: sinon.stub(),
                increaseAnnualDiscountUsage: sinon.stub().throws(new Error('Failed to increase annual discount usage'))
            };

            sinon.stub(EmployeeMgr, 'createEmployee').returns(employee);
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };

            assert.throws(() => {
                EmployeeMgr.createEmployeeFromLegacyProfile(profile);
            }, `Failed to create employee ${profile.custom.employeeNumber} from profile with customer number ${profile.customerNo}: Failed to increase annual discount usage`);
            sinon.restore();
        });
        it('should throw if created employee cannot be linked to profile', () => {
            const employee = {
                setCustomer: sinon.stub().throws(new Error('Failed to link employee to profile')),
                increaseAnnualDiscountUsage: sinon.stub()
            };

            sinon.stub(EmployeeMgr, 'createEmployee').returns(employee);
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };

            assert.throws(() => {
                EmployeeMgr.createEmployeeFromLegacyProfile(profile);
            }, `Failed to create employee ${profile.custom.employeeNumber} from profile with customer number ${profile.customerNo}: Failed to link employee to profile`);
            sinon.restore();
        });
        it('should throw if legacy attributes clearing fails', () => {
            mockAccountHelpers.clearEmployeeLegacyAttributes.throws(new Error('Failed to clear legacy attributes'));
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };
            const employee = {setCustomer: sinon.stub(), increaseAnnualDiscountUsage: sinon.stub()};

            sinon.stub(EmployeeMgr, 'createEmployee').returns(employee);

            assert.throws(() => {
                EmployeeMgr.createEmployeeFromLegacyProfile(profile);
            }, `Failed to create employee ${profile.custom.employeeNumber} from profile with customer number ${profile.customerNo}: Failed to clear legacy attributes`);
            sinon.restore();
        });
        it('should return new employee instance if no errors', () => {
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };
            const employee = {setCustomer: sinon.stub(), increaseAnnualDiscountUsage: sinon.stub()};

            sinon.stub(EmployeeMgr, 'createEmployee').returns(employee);

            const result = EmployeeMgr.createEmployeeFromLegacyProfile(profile);

            assert.equal(result, employee);
        });

        it('should throw if existing employee cannot be overwritten', () => {
            const existingEmployee = {ID: 'EMP001'};
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500
                }
            };

            sinon.stub(EmployeeMgr, 'getEmployeeById').returns(existingEmployee);
            sinon.stub(EmployeeMgr, 'removeEmployee');
            sinon.stub(EmployeeMgr, 'createEmployee').throws(new Error('Employee creation failed'));

            assert.throws(() => {
                EmployeeMgr.createEmployeeFromLegacyProfile(profile);
            }, `Failed to create employee ${profile.custom.employeeNumber} from profile with customer number ${profile.customerNo}: Employee creation failed`);
            sinon.restore();
        });
        it('should return new employee instance if existing one successfully overwritten', () => {
            const existingCustomObject = { custom: { ID: 'EMP001' } };

            mockCustomObjectMgr.getCustomObject.returns(existingCustomObject);

            const newEmployee = {ID: 'EMP001', setCustomer: sinon.stub(), increaseAnnualDiscountUsage: sinon.stub()};
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 500,
                    remainingDiscountLimit: 250,
                    employeeZipCode: '12345',
                    companyID: 'TEST',
                    unlimitedTotalDiscount: false
                }
            };
            const removeEmployeeSpy = sinon.spy(EmployeeMgr, 'removeEmployee');

            sinon.stub(EmployeeMgr, 'getAnnualDiscountAllowance').returns(500);
            sinon.stub(EmployeeMgr, 'createEmployee').returns(newEmployee);

            const result = EmployeeMgr.createEmployeeFromLegacyProfile(profile);

            assert.isTrue(removeEmployeeSpy.calledOnce, 'removeEmployee should have been called once');
            assert.isTrue(EmployeeMgr.createEmployee.calledOnce, 'createEmployee should have been called once');
            assert.equal(result, newEmployee);
        });
        it('should return new employee instance with uncapped allowance if totalDiscountLimit is placeholder value 9999999', () => {
            const profile = {
                customerNo: 'CUST001',
                custom: {
                    employeeNumber: 'EMP001',
                    isEmployee: true,
                    employeeShippingCountry: 'US',
                    employeeGroup: 'STANDARD',
                    totalDiscountLimit: 9999999,
                    remainingDiscountLimit: 9999999,
                    employeeZipCode: '12345',
                    companyID: 'TEST',
                    unlimitedTotalDiscount: true
                }
            };
            const newEmployee = {ID: 'EMP001', setCustomer: sinon.stub(), increaseAnnualDiscountUsage: sinon.stub()};

            sinon.stub(EmployeeMgr, 'createEmployee').returns(newEmployee);
            sinon.stub(EmployeeMgr, 'getAnnualDiscountAllowance').returns(9999999);

            const result = EmployeeMgr.createEmployeeFromLegacyProfile(profile);

            assert.isTrue(EmployeeMgr.createEmployee.calledOnce, 'createEmployee should have been called once');
            assert.equal(result, newEmployee);
        });
    });

    describe('.getEmployeeById()', () => {
        it('should return null for empty ID', () => {
            assert.isNull(EmployeeMgr.getEmployeeById(''));
            assert.isNull(EmployeeMgr.getEmployeeById(null));
        });

        it('should return null when getCustomObject throws an error', () => {
            mockCustomObjectMgr.getCustomObject.throws(new Error('IllegalArgumentException: Invalid argument provided'));

            assert.isNull(EmployeeMgr.getEmployeeById('TEST123'));
        });

        it('should return null when employee does not exist', () => {
            mockCustomObjectMgr.getCustomObject.returns(null);

            const result = EmployeeMgr.getEmployeeById('NONEXISTENT');

            assert.isNull(result);
            assert.isTrue(mockCustomObjectMgr.getCustomObject.calledOnceWith('Employee', 'NONEXISTENT'));
        });

        it('should return null when failed to instantiate Employee', () => {
            const mockEmployeeCO = {
                custom: {
                    ID: 'TEST123',
                    countryCode: 'US'
                }
            };

            const error = new Error('Failed to initialize Employee');

            mockEmployee.prototype.initialize.throws(error);
            mockCustomObjectMgr.getCustomObject.returns(mockEmployeeCO);

            const result = EmployeeMgr.getEmployeeById('TEST123');

            assert.isNull(result);
            assert.isTrue(mockLogger.error.calledWith('Failed to retrieve employee CustomObject: Failed to initialize Employee'));
        });

        it('should return Employee instance when employee exists', () => {
            const mockEmployeeCO = {
                custom: {
                    ID: 'TEST123',
                    countryCode: 'US'
                }
            };

            mockCustomObjectMgr.getCustomObject.withArgs('Employee', 'TEST123').returns(mockEmployeeCO);

            const result = EmployeeMgr.getEmployeeById('TEST123');

            assert.instanceOf(result, mockEmployee);
            assert.equal(result.apiEmployee, mockEmployeeCO);
            assert.isTrue(mockCustomObjectMgr.getCustomObject.calledOnceWith('Employee', 'TEST123'));
        });

        describe('when partner company employee', () => {
            const companyID = 'ACME';
            const employeeNumber = '123';
            const concatenatedID = `${companyID}-${employeeNumber}`;

            beforeEach(() => {
                mockCustomObjectMgr.getCustomObject.withArgs('Employee', concatenatedID).returns({
                    custom: {
                        ID: concatenatedID,
                        countryCode: 'US',
                        companyID
                    }
                });
            });

            it('should return partner company Employee instance for already prefixed ID', () => {
                const prefixedEmployeeNumber = `${companyID}-${employeeNumber}`;

                const result = EmployeeMgr.getEmployeeById(prefixedEmployeeNumber);

                assert.equal(result.apiEmployee.custom.ID, concatenatedID);
            });

            it('should return partner company Employee instance for non-already prefixed ID', () => {
                const nonPrefixedEmployeeNumber = employeeNumber;

                const result = EmployeeMgr.getEmployeeById(nonPrefixedEmployeeNumber, companyID);

                assert.equal(result.apiEmployee.custom.ID, concatenatedID);
            });

            it('should return partner company Employee instance without double prefixing the ID', () => {
                const prefixedEmployeeNumber = `${companyID}-123`;

                const result = EmployeeMgr.getEmployeeById(prefixedEmployeeNumber, companyID);

                assert.equal(result.apiEmployee.custom.ID, concatenatedID);
            });
        });
    });

    describe('.getAnnualDiscountAllowance()', () => {
        beforeEach(() => {
            sitepref.getJSONValue.returns({
                'DE': {'STANDARD': 500, 'PREMIUM': 1000}
            });
        });
        it('should return 0 for empty country code', () => {
            assert.equal(EmployeeMgr.getAnnualDiscountAllowance(null, 'STANDARD'), 0);
            assert.equal(EmployeeMgr.getAnnualDiscountAllowance('', 'STANDARD'), 0);
        });
        it('should return 0 for empty discount group', () => {
            assert.equal(EmployeeMgr.getAnnualDiscountAllowance('EU', null), 0);
            assert.equal(EmployeeMgr.getAnnualDiscountAllowance('EU', ''), 0);
        });
        it('should return 0 when no discount mapping retrieved', () => {
            sitepref.getJSONValue.returns(null);
            const result = EmployeeMgr.getAnnualDiscountAllowance('EU', 'STANDARD');

            assert.equal(result, 0);
        });
        it('should return 0 when country code is not found in mapping', () => {
            const result = EmployeeMgr.getAnnualDiscountAllowance('IT', 'STANDARD');

            assert.equal(result, 0);
        });
        it('should return 0 when discount group is not found in mapping', () => {
            const result = EmployeeMgr.getAnnualDiscountAllowance('EU', 'NON_EXISTENT_GROUP');

            assert.equal(result, 0);
        });
        it('should return 0 when no allowance found in mapping', () => {
            sitepref.getJSONValue.returns({
                'EU': {'STANDARD': 500}
            });

            const result = EmployeeMgr.getAnnualDiscountAllowance('EU', 'NON_EXISTENT_GROUP');

            assert.equal(result, 0);
        });
        it('should return 0 when invalid allowance found in mapping', () => {
            sitepref.getJSONValue.returns({
                // legacy value 'UNLIMITED' is not valid
                'EU': {'STANDARD': 500, 'PREMIUM': 'UNLIMITED'}
            });

            const result = EmployeeMgr.getAnnualDiscountAllowance('EU', 'PREMIUM');

            assert.equal(result, 0);
        });
        it('should return allowance found in mapping', () => {
            const resultStandard = EmployeeMgr.getAnnualDiscountAllowance('DE', 'STANDARD');
            const resultPremium = EmployeeMgr.getAnnualDiscountAllowance('DE', 'PREMIUM');

            assert.equal(resultStandard, 500);
            assert.equal(resultPremium, 1000);
        });
    });

    describe('.getEmployeeByCustomerNumber()', () => {
        it('should return null for empty customer number', () => {
            assert.isNull(EmployeeMgr.getEmployeeByCustomerNumber(''));
            assert.isNull(EmployeeMgr.getEmployeeByCustomerNumber(null));
        });

        it('should return null when search throws an error', () => {
            mockCustomObjectMgr.queryCustomObject.throws(new Error('IllegalArgumentException: Invalid argument provided'));

            assert.isNull(EmployeeMgr.getEmployeeByCustomerNumber('CUST123'));
            assert.isTrue(mockLogger.error.calledWith('Failed to retrieve employee by customer number: IllegalArgumentException: Invalid argument provided'));
        });

        it('should return null when no results', () => {
            mockCustomObjectMgr.queryCustomObject.returns(null);

            const result = EmployeeMgr.getEmployeeByCustomerNumber('CUST123');

            assert.isNull(result);
            assert.isTrue(mockCustomObjectMgr.queryCustomObject.calledOnceWith('Employee', 'custom.customerNumber = {0}', 'CUST123'));
        });

        it('should return null when failed to instantiate matching Employee', () => {
            const mockEmployeeCO = {
                custom: {
                    ID: 'EMP001',
                    customerNumber: 'CUST123'
                }
            };

            mockEmployee.prototype.initialize.throws(new Error('Failed to initialize Employee'));
            mockCustomObjectMgr.queryCustomObject.returns(mockEmployeeCO);

            const result = EmployeeMgr.getEmployeeByCustomerNumber('CUST123');

            assert.isNull(result);
            assert.isTrue(mockLogger.error.calledWith('Failed to retrieve employee by customer number: Failed to initialize Employee'));
        });

        it('should return retrieved Employee instance', () => {
            const mockEmployeeCO = {
                custom: {
                    ID: 'EMP001',
                    customerNumber: 'CUST123'
                }
            };

            mockCustomObjectMgr.queryCustomObject.returns(mockEmployeeCO);

            const result = EmployeeMgr.getEmployeeByCustomerNumber('CUST123');

            assert.instanceOf(result, mockEmployee);
            assert.equal(result.apiEmployee, mockEmployeeCO);
        });
    });

    describe('.removeEmployee()', () => {
        it('should throw if no employee provided', () => {
            assert.throws(() => {
                EmployeeMgr.removeEmployee(null);
            }, 'Invalid argument: employee must be a valid Employee instance.');
        });
        it('should throw if employee is not an instance of Employee', () => {
            assert.throws(() => {
                EmployeeMgr.removeEmployee({});
            }, 'Invalid argument: employee must be a valid Employee instance.');
        });
        it('should throw if employee removal fails', () => {
            const employee = new mockEmployee();

            sinon.stub(employee, 'resetCustomer').throws(new Error('Remove failed'));

            assert.throws(() => {
                EmployeeMgr.removeEmployee(employee);
            }, 'Failed to remove employee CustomObject: Remove failed');
        });
        it('should successfully remove employee', () => {
            const employee = new mockEmployee();

            employee.apiEmployee = mockCustomObject;

            const resetCustomerSpy = sinon.spy(employee, 'resetCustomer');

            EmployeeMgr.removeEmployee(employee);

            assert.isTrue(resetCustomerSpy.calledOnce);
            assert.isTrue(mockCustomObjectMgr.remove.calledOnceWith(mockCustomObject));
            assert.isTrue(mockTransaction.wrap.called);
        });
    });

    describe('.saveEmployee()', () => {
        it('should create new employee when employee does not exist', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                companyID: 'ACME',
                zipCode: '12345',
                discountGroup: 'STANDARD',
                unlimitedDiscount: false
            };

            mockCustomObjectMgr.getCustomObject.returns(null);

            EmployeeMgr.saveEmployee(params);

            assert.isTrue(mockCustomObjectMgr.createCustomObject.calledOnceWith('Employee', 'ACME-TEST123'));
        });

        it('should update existing employee when employee exists', () => {
            const params = {
                ID: 'TEST123',
                countryCode: 'US',
                customAnnualDiscountAllowance: 1000,
                zipCode: '12345',
                discountGroup: 'STANDARD',
                unlimitedDiscount: false
            };

            const existingEmployeeCO = {
                custom: {
                    ID: 'TEST123',
                    countryCode: 'US'
                }
            };

            mockCustomObjectMgr.getCustomObject.returns(existingEmployeeCO);

            EmployeeMgr.saveEmployee(params);

            assert.isFalse(mockCustomObjectMgr.createCustomObject.called);
            assert.isTrue(mockTransaction.wrap.called);
        });
    });

    describe('.getAllEmployees()', () => {
        it('should return ES6Iterator with all employees', () => {
            const mockEmployeeCOs = ['employee1', 'employee2'];

            mockCustomObjectMgr.getAllCustomObjects.returns(mockEmployeeCOs);

            const result = EmployeeMgr.getAllEmployees();

            assert.instanceOf(result, ES6Iterator);
            assert.isTrue(mockCustomObjectMgr.getAllCustomObjects.calledOnceWith('Employee'));
        });
    });

    describe('.queryEmployees()', () => {
        it('should delegate to getAllEmployees when query is empty string', () => {
            mockCustomObjectMgr.getAllCustomObjects.returns([]);

            EmployeeMgr.queryEmployees('');

            assert.isFalse(mockCustomObjectMgr.queryCustomObjects.called);
            assert.isTrue(mockCustomObjectMgr.getAllCustomObjects.calledOnceWith('Employee'));
        });

        it('should delegate to getAllEmployees when query is falsy', () => {
            const mockAllCOs = ['all1', 'all2'];

            mockCustomObjectMgr.getAllCustomObjects.returns(mockAllCOs);

            const result = EmployeeMgr.queryEmployees(null);

            assert.instanceOf(result, ES6Iterator);
            assert.isFalse(mockCustomObjectMgr.queryCustomObjects.called);
            assert.isTrue(mockCustomObjectMgr.getAllCustomObjects.calledOnceWith('Employee'));
        });

        it('should handle empty params array', () => {
            const query = 'custom.customerNumber != NULL';

            mockCustomObjectMgr.queryCustomObjects.returns([]);

            EmployeeMgr.queryEmployees(query, null, []);

            assert.isTrue(mockCustomObjectMgr.queryCustomObjects.calledOnceWith('Employee', query, 'custom.ID asc', []));
        });

        it('should default to custom.ID asc when sortString is falsy', () => {
            const query = "custom.countryCode = 'US'";

            mockCustomObjectMgr.queryCustomObjects.returns([]);

            EmployeeMgr.queryEmployees(query, null);

            assert.equal(mockCustomObjectMgr.queryCustomObjects.firstCall.args[2], 'custom.ID asc');
        });

        it('should pass params array directly to queryCustomObjects', () => {
            const query = "custom.countryCode = 'DE' AND custom.discountGroup = 'B'";
            const params = ['DE', 'B'];

            mockCustomObjectMgr.queryCustomObjects.returns([]);

            EmployeeMgr.queryEmployees(query, null, params);

            assert.isTrue(mockCustomObjectMgr.queryCustomObjects.calledOnceWith('Employee', query, 'custom.ID asc', params));
        });

        it('should return ES6Iterator with queried employees', () => {
            const mockEmployeeCOs = ['employee1', 'employee2'];
            const countryCode = 'US';
            const query = `custom.countryCode = '${countryCode}'`;
            const sortString = 'custom.ID asc';
            const params = [countryCode];

            mockCustomObjectMgr.queryCustomObjects.returns(mockEmployeeCOs);

            const result = EmployeeMgr.queryEmployees(query, sortString, params);

            assert.instanceOf(result, ES6Iterator);
            assert.isTrue(mockCustomObjectMgr.queryCustomObjects.calledOnceWith('Employee', query, sortString, params));
        });
    });

    describe('.removeEmployeeById()', () => {
        it('should get employee by ID and call removeEmployee', () => {
            const employeeId = 'EMP001';
            const mockEmployeeCO = {
                custom: {
                    ID: employeeId,
                    countryCode: 'US'
                }
            };

            mockCustomObjectMgr.getCustomObject.returns(mockEmployeeCO);

            EmployeeMgr.removeEmployeeById(employeeId);

            assert.isTrue(mockCustomObjectMgr.getCustomObject.calledWith('Employee', employeeId));
            assert.isTrue(mockCustomObjectMgr.remove.called);
        });
    });
});

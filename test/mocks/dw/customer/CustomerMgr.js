function getCustomerByCustomerNumber() {
    return {
        addressBook: {
            getAddresses: function () {
                return {
                    address1: '1 Drury Lane',
                    address2: null,
                    firstName: 'The Muffin',
                    lastName: 'Man',
                    city: 'Far Far Away',
                    phone: '333-333-3333',
                    postalCode: '04330',
                    ID: 'space1',
                    addressId: 'space1',
                    jobTitle: 'super boss',
                    postBox: 'postBox',
                    salutation: 'Mr',
                    secondName: 'Solo',
                    companyName: 'SpaceX',
                    countryCode: {
                        displayValue: 'United States',
                        value: 'US'
                    },
                    states: {
                        stateCode: 'ME'
                    },
                    UUID: '97834gh8347236bcyrgsygdfef6'
                };
            },
            getPreferredAddress: function () {
                return {
                    address1: '1 Drury Lane',
                    address2: null,
                    firstName: 'The Muffin',
                    lastName: 'Man',
                    city: 'Far Far Away',
                    phone: '333-333-3333',
                    postalCode: '04330',
                    ID: 'space1',
                    addressId: 'space1',
                    jobTitle: 'super boss',
                    postBox: 'postBox',
                    salutation: 'Mr',
                    secondName: 'Solo',
                    companyName: 'SpaceX',
                    countryCode: {
                        displayValue: 'United States',
                        value: 'US'
                    },
                    states: {
                        stateCode: 'ME'
                    },
                    addressUUID: '97834gh8347236bcyrgsygdfef6',
                    UUID: '97834gh8347236bcyrgsygdfef6'
                };
            }
        },
        profile: {
            email: 'email@test.com',
            firstName: 'firstName',
            lastName: 'lastName',
            salutation: 'Mr.',
            gender: 1,
            birthday: null,
            firstNameKatakana: 'firstNameKatakana',
            lastNameKatakana: 'lastNameKatakana',
            areaCode: '+1',
            preferredStoreID: 'store1',
            isEmployee: false,
            employeeNumber: '',
            getAddressBook: () => {
                return this.addressBook;
            },
            getEmail: function () {
                return this.email;
            },
            getFirstName: function () {
                return this.firstName;
            },
            getLastName: function () {
                return this.lastName;
            }
        },
        getProfile: function () {
            return this.profile;
        },
        registered: true,
        authenticated: true
    };
}

function getCustomerByLogin(email) {
    return email && email !== 'not existing email' ? getCustomerByCustomerNumber() : null;
}

function authenticateCustomer(email, password) {
    const customerPasswords = {
        'email1': 'password1'
    };

    const authorizationResult = customerPasswords[email] && customerPasswords[email] === password;

    if (authorizationResult) {
        return {
            status: 'AUTH_OK'
        };
    } else {
        return {
            status: 'ERROR_CUSTOMER_DISABLED'
        };
    }
}

function loginCustomer(authenticateCustomerResult, rememberMe) {
    return {
        authenticateCustomerResult: authenticateCustomerResult,
        rememberMe: rememberMe
    };
}

module.exports = {
    authenticateCustomer: authenticateCustomer,
    loginCustomer: loginCustomer,
    getCustomerByCustomerNumber: getCustomerByCustomerNumber,
    getCustomerByLogin: getCustomerByLogin,
    createCustomer: () => {
        const { createProfile } = require('#mocks/testDataMgr/instances/dw/customer/Profile');

        return {
            profile: createProfile(),
            getProfile: function () {
                return this.profile;
            }
        };
    },
    searchProfile: (query, ...params) => {
        if (query && params) {
            return {
                getCustomer: () => getCustomerByCustomerNumber()
            };
        }

        return null;
    },
    createExternallyAuthenticatedCustomer: () => {},
    loginExternallyAuthenticatedCustomer: () => {},
    processProfiles: () => {}
};

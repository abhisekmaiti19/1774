class Employee {
    constructor(apiEmployee) {
        this.apiEmployee = apiEmployee;

        this.initialize();
    }

    initialize() {}

    resetCustomer() {}

    setCountryCode(countryCode) {
        this.countryCode = countryCode;
    }
}

module.exports = Employee;

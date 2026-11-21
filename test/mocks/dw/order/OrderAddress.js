const EnumValue = require('../value/EnumValue');

class OrderAddress {
    custom = {};

    getAddress1() {
        return this.address1;
    }

    getAddress2() {
        return this.address2;
    }

    getCity() {
        return this.city;
    }

    getCompanyName() {
        return this.companyName;
    }

    getCountryCode() {
        return this.countryCode;
    }

    getFirstName() {
        return this.firstName;
    }

    getFullName() {
        return this.fullName;
    }

    getLastName() {
        return this.lastName;
    }

    getPhone() {
        return this.phone;
    }

    getPostalCode() {
        return this.postalCode;
    }

    getPostBox() {
        return this.postBox;
    }

    getSalutation() {
        return this.salutation;
    }

    getSecondName() {
        return this.secondName;
    }

    getStateCode() {
        return this.stateCode;
    }

    getSuffix() {
        return this.suffix;
    }

    getSuite() {
        return this.suite;
    }

    getTitle() {
        return this.title;
    }

    isEquivalentAddress(address) {
        return (
            address.address1 === this.address1
            && address.address2 === this.address2
            && address.city === this.city
            && address.companyName === this.companyName
            && address.countryCode === this.countryCode
            && address.firstName === this.firstName
            && address.lastName === this.lastName
            && address.postalCode === this.postalCode
            && address.postBox === this.postBox
            && address.stateCode === this.stateCode
        );
    }

    setAddress1(value) {
        this.address1 = value;
    }

    setAddress2(value) {
        this.address2 = value;
    }

    setCity(city) {
        this.city = city;
    }

    setCompanyName(companyName) {
        this.companyName = companyName;
    }

    setCountryCode(countryCode) {
        this.countryCode = new EnumValue(countryCode, countryCode);
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setJobTitle(jobTitle) {
        this.jobTitle = jobTitle;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    setPhone(phoneNumber) {
        this.phone = phoneNumber;
    }

    setPostalCode(postalCode) {
        this.postalCode = postalCode;
    }

    setPostBox(postBox) {
        this.postBox = postBox;
    }

    setSalutation(value) {
        this.salutation = value;
    }

    setSecondName(secondName) {
        this.secondName = secondName;
    }

    setStateCode(state) {
        this.stateCode = state;
    }

    setSuffix(suffix) {
        this.suffix = suffix;
    }

    setSuite(value) {
        this.value = value;
    }

    setTitle(title) {
        this.title = title;
    }
}

module.exports = OrderAddress;

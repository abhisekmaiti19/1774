const CustomerAddress = require('./CustomerAddress');
const List = require('../util/List');
const { createUUID } = require('../util/UUIDUtils');

class AddressBook {
    addresses = new List();

    preferredAddress;

    createAddress(name) {
        const alreadyExist = this.addresses
            .toArray()
            .some(address => address.ID === name);

        if (alreadyExist) {
            return null;
        }

        const address = new CustomerAddress();

        address.ID = name;
        address.UUID = createUUID();

        this.addresses.add(address);

        return address;
    }

    getAddress(id) {
        return this.addresses
            .toArray()
            .find(address => address.ID === id);
    }

    getAddresses() {
        return this.addresses;
    }

    getPreferredAddress() {
        return this.preferredAddress;
    }

    removeAddress(address) {
        this.addresses.remove(address);
    }

    setPreferredAddress(anAddress) {
        this.preferredAddress = anAddress;
    }
}

module.exports = AddressBook;

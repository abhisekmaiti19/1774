class Profile {
    custom = {};

    firstName = 'firstName';

    lastName = 'lastName';

    phoneHome = '+1234567890';

    email = 'test@email.com';

    describe() {
        return {
            getCustomAttributeDefinition(attributeName) {
                return {
                    getDefaultValue() {
                        return {
                            displayName: attributeName,
                            value: attributeName
                        };
                    }
                };
            }
        };
    }

    getWallet() {
        return this.wallet;
    }
}

module.exports = Profile;

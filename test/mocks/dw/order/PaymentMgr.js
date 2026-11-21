module.exports = {
    getActivePaymentMethods: function () {
        return [];
    },
    getApplicablePaymentMethods: function () {},
    getPaymentCard: function () {
        return {
            name: 'Amex'
        };
    },
    getPaymentMethod: function () {
        return {
            custom: {},
            getApplicablePaymentCards: function () {
                return [{
                    name: 'Amex'
                }];
            },
            getPaymentProcessor: () => {
                return {
                    ID: 'MockProcessor'
                };
            }
        };
    }
};

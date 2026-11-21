const mapping = {
    'ProductsAvailability': {
        'Boilerplate-NA,001': { availability: '1' },
        'Boilerplate-UK,001': { availability: '1' }
    },
    'CatalogsAvailability': {
        'Boilerplate-NA,womens-tops-tshirts': { availability: '1' },
        'Boilerplate-UK,womens-tops-tshirts': { availability: '1' }
    }
};

module.exports = {
    get(mappingName, mappingKey) {
        if (Object.prototype.hasOwnProperty.call(mapping, mappingName) && Object.prototype.hasOwnProperty.call(mapping[mappingName], mappingKey)) {
            return mapping[mappingName][mappingKey];
        }

        throw new Error('No such mapping found');
    }
};

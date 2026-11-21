exports.mochaGlobalSetup = async function () {
    global.params = {
        siteID: 'EU'
    };

    const Collection = require('#mocks/dw/util/Collection');

    const empty = function (variable) {
        let isEmpty = true;

        if (Array.isArray(variable) || variable instanceof Collection) {
            isEmpty = variable.length === 0;
        } else if (variable) {
            isEmpty = false;
        }

        return isEmpty;
    };

    beforeEach(() => {
        global.empty = empty;
    })
};

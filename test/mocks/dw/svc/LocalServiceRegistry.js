const { createAlwaysOkService } = require('../../testDataMgr/instances/dw/svc/Service');

class LocalServiceRegistry {
    static createService(serviceId, configObj) {
        return createAlwaysOkService(serviceId, configObj);
    }
}

module.exports = LocalServiceRegistry;

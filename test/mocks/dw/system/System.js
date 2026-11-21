const Calendar = require('../util/Calendar');

const DEVELOPMENT_SYSTEM = 0;

module.exports = {
    instanceType: DEVELOPMENT_SYSTEM,
    getInstanceType: function () {
        return DEVELOPMENT_SYSTEM;
    },
    getCalendar: function () {
        return new Calendar(new Date());
    },
    DEVELOPMENT_SYSTEM: DEVELOPMENT_SYSTEM,
    STAGING_SYSTEM: 1,
    PRODUCTION_SYSTEM: 2,
    instanceHostname: 'long-instance-hostname.com'
};

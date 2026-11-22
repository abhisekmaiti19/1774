const Site = require('dw/system/Site');
const currentSite = Site.getCurrent().getPreferences().getCustom();

module.exports = {
  isEmployeeBenifitsActive: Boolean(currentSite['isEmployeeBenifitActive']),
  employeeBenifitsConfigs: safeParseJSON(currentSite['employeeBenifitsConfigs'])
};

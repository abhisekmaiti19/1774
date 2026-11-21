const { createShippingMethod } = require('../../testDataMgr/instances/dw/order/ShippingMethod');
const { createShipmentShippingModel } = require('../../testDataMgr/instances/dw/order/ShipmentShippingModel');

module.exports.getDefaultShippingMethod = () => createShippingMethod();

module.exports.getShipmentShippingModel = () => createShipmentShippingModel();

module.exports.applyShippingCost = () => {};

"use strict";

/**
 * Minimal SFCC product mock. A 1774 product has a first `productGroup` value
 * beginning with `6`, for example `600`.
 *
 * @param {object} [overrides] properties to apply to the mock product
 * @returns {void}
 */
function Product(overrides = {}) {
  Object.assign(this, overrides);
  this.custom = overrides.custom || {};
}

/**
 * Create a product that belongs to the 1774 main product group.
 *
 * @param {object} [overrides] properties to apply to the mock product
 * @returns {Product} 1774 product mock
 */
Product.create1774Product = function (overrides = {}) {
  return new Product(
    Object.assign({}, overrides, {
      custom: Object.assign({ productGroup: ["600"] }, overrides.custom),
    }),
  );
};

module.exports = Product;

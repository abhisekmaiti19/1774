# Employee Feature Exercise

Install the dependencies with `npm ci`.

Run all unit tests with:

    npm test

The command automatically discovers tests in `test/unit/`. The exercise source is located in `cartridges/app_custom_core/cartridge/scripts/`.

## Task: 1774 employee discount

'1774' products, are special high value products and a different product category in birkenstock context - https://www.birkenstock.com/de-en/1774/.

### User story

As an Ecommerce Manager, I want to create a custom promotion setup requested by the 1774 team, so that North America employees can receive a discount on 1774 items.

### Acceptance criteria

- Adopt the Employee.js & EmployeeMgr.js to support
  - additional allowance
  - additional product groups
- The annual allowance for this separate budged is $1000 cap
- The solution must be reusable for other regions, e.g. EU through configuration.
- The solution must be extensible to more product categories as well.

### Additional details

- The existing US employee discount remains separate: non-1774 items and has no spend cap
- The existing rest of world employee discount remains separate
- You are allowed to alter the custom object structure
- You should focus on having your new implementation covered by tests.
  - A good starting point is `increaseAnnualDiscountUsage()` and `decreaseAnnualDiscountUsage()`.
- All existing tests should pass.
- If something is unclear from a requirements perspective, make a best guess and add constraints in a comment.

### Out of scope

Identifying whether a product belongs to the 1774 group is not part of this task. The caller provides the relevant product-group or category identifier to the employee-discount logic.

## Existing Employee Custom Object

Employee eligibility and allowance usage are stored in an SFCC Custom Object with type `Employee`. The following is a representative object; values are examples only:

```json
{
  "type": "Employee",
  "custom": {
    "ID": "EMP001",
    "customerNumber": "CUST123",
    "zipCode": "12345",
    "countryCode": "US",
    "companyID": "BIRK",
    "discountGroup": "EMPLOYEE",
    "customAnnualDiscountAllowance": 1000,
    "annualDiscountUsage": 250,
    "unlimitedDiscount": false,
    "lastAllowanceReset": "2026-01-01T00:00:00.000Z"
  }
}
```

- `annualDiscountUsage` tracks use of the existing employee allowance.
- `customAnnualDiscountAllowance` is an optional per-employee override; otherwise the allowance is determined from country and discount-group configuration.
- `unlimitedDiscount` exempts the existing employee discount from its allowance, but must not exempt the new 1774 allowance.

# 1774 Employee Discount

**Technical Design:** [Notion LLD](https://app.notion.com/p/Birkenstock-1774-41f74b592bbb8093a484ec2c4cdcca7d?source=copy_link)

## File Changes

| File | Changes |
|---|---|
| `Employee.js` | Added category-specific allowance tracking, usage management and annual reset support. |
| `EmployeeMgr.js` | Initializes category benefits based on employee country and configuration. |
| `helpers/customPreference.js` | [NEW] Reads employee benefit feature flag and category configurations. |
| `helpers/utils/index.js` | [NEW] Adds safe JSON parsing utility. |
| `helpers/employeeHelpers.js` | Updated existing employee allowance validation. |
| `test/unit/.../Employee.js` | Added category allowance and reset test cases. |
| `test/unit/.../EmployeeMgr.js` | Added configuration and employee initialization tests. |
| `test/unit/.../helpers/employeeHelpers.js` | Updated allowance validation tests. |
| `test/unit/.../helpers/customPreference.js` | [NEW] Added preference helper tests. |
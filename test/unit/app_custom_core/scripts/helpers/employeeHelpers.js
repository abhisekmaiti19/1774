"use strict";

const sinon = require("sinon");
const assert = require("chai").assert;
const proxyquire = require("proxyquire").noCallThru().noPreserveCache();

const Campaign = require("#mocks/dw/campaign/Campaign");
const PromotionPlan = require("#mocks/dw/campaign/PromotionPlan");
const Promotion = require("#mocks/dw/campaign/Promotion");
const Transaction = require("#mocks/dw/system/Transaction");

let employeeHelpers;
let PromotionMgrMock;
let ResourceMock;
let campaignMock;
let promotionPlanMock;
let shippingPromotionMock;
let siteHelpersStub;
let getActivePromotionsStub;
let getActiveProductPromotionsStub;
let getActiveCustomerProductPromotionStub;
let CustomerMgrMock;
let CustomObjectMgrMock;
let EmployeeMgrMock;

describe("app_custom_core/cartridge/scripts/helpers/employeeHelpers", () => {
  beforeEach(() => {
    campaignMock = sinon.createStubInstance(Campaign);
    promotionPlanMock = sinon.createStubInstance(PromotionPlan);
    shippingPromotionMock = sinon.createStubInstance(Promotion);
    siteHelpersStub = {
      getCurrentShopCountryCode: sinon.stub().returns("DE"),
    };

    PromotionMgrMock = {
      getCampaign: sinon.stub(),
      getActiveCustomerPromotionsForCampaign: sinon.stub(),
      getActivePromotionsForCampaign: sinon.stub(),
    };

    ResourceMock = {
      msg: sinon.stub(),
    };

    employeeHelpers = proxyquire(
      "#cartridges/app_custom_core/cartridge/scripts/helpers/employeeHelpers",
      {
        "dw/campaign/PromotionMgr": PromotionMgrMock,
        "dw/web/Resource": ResourceMock,
        "dw/system/Transaction": Transaction,
        "*/cartridge/scripts/helpers/siteHelpers": siteHelpersStub,
      },
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe(".getActivePromotions()", () => {
    const campaignID = "test-employee-campaign";

    beforeEach(() => {
      ResourceMock.msg
        .withArgs("campaign.id.employees", "merchantTools", null)
        .returns(campaignID);
      PromotionMgrMock.getCampaign.withArgs(campaignID).returns(campaignMock);
    });

    it("should throw an error if campaign is not found", () => {
      PromotionMgrMock.getCampaign.withArgs(campaignID).returns(null);

      assert.throws(
        () => employeeHelpers.getActivePromotions(),
        Error,
        "'Employee' campaign not found: please ensure it is active and scheduled continuously",
      );
    });

    it("should return all active promotions", () => {
      PromotionMgrMock.getActiveCustomerPromotionsForCampaign.returns(
        promotionPlanMock,
      );

      const result = employeeHelpers.getActivePromotions();

      assert.equal(result, promotionPlanMock);
    });
  });

  describe(".getActiveProductPromotions()", () => {
    const mockProductPromotions = { productPromotions: "test" };

    beforeEach(() => {
      getActivePromotionsStub = sinon.stub(
        employeeHelpers,
        "getActivePromotions",
      );
      promotionPlanMock.getProductPromotions.returns(mockProductPromotions);
    });

    it("should return active product promotions", () => {
      getActivePromotionsStub.returns(promotionPlanMock);

      const result = employeeHelpers.getActiveProductPromotions();

      assert.equal(result, mockProductPromotions);
    });
  });

  describe(".getActiveShippingPromotions()", () => {
    const mockShippingPromotions = { shippingPromotions: "test" };

    beforeEach(() => {
      getActivePromotionsStub = sinon.stub(
        employeeHelpers,
        "getActivePromotions",
      );
      promotionPlanMock.getShippingPromotions.returns(mockShippingPromotions);
    });

    it("should return shipping promotions", () => {
      getActivePromotionsStub.returns(promotionPlanMock);

      const result = employeeHelpers.getActiveShippingPromotions();

      assert.equal(result, mockShippingPromotions);
    });
  });

  describe(".getActiveCustomerProductPromotion()", () => {
    const hiringCountry = "DE";

    beforeEach(() => {
      getActiveProductPromotionsStub = sinon.stub(
        employeeHelpers,
        "getActiveProductPromotions",
      );
    });

    it("should return null when not an employee session", () => {
      global.session = { custom: {} };

      getActiveProductPromotionsStub.returns([]);

      const result = employeeHelpers.getActiveCustomerProductPromotion();

      assert.isNull(result);
    });

    it("should return null when hiring country differs from current shop country", () => {
      global.session = { custom: { hiringCountry: "US" } };
      siteHelpersStub.getCurrentShopCountryCode.returns("DE");

      const result = employeeHelpers.getActiveCustomerProductPromotion();

      assert.isNull(result);
    });

    it("should throw an error when no promotion found", () => {
      global.session = { custom: { hiringCountry } };
      getActiveProductPromotionsStub.returns([]);

      assert.throws(
        () => employeeHelpers.getActiveCustomerProductPromotion(),
        Error,
        `No employee product promotion found: please ensure employee promotion set up for country [${hiringCountry}] and company [Birkenstock]`,
      );
    });

    it("should throw an error when multiple promotions found", () => {
      const companyID = "ACME";

      global.session = { custom: { hiringCountry, companyID } };

      getActiveProductPromotionsStub.returns([
        { custom: { discountRate: 10 } },
        { custom: { discountRate: 20 } },
      ]);

      assert.throws(
        () => employeeHelpers.getActiveCustomerProductPromotion(),
        Error,
        `Multiple employee product promotions found for [${hiringCountry}] and [${companyID}]: please ensure uniqueness of promotions an employee can qualify for`,
      );
    });

    it("should return the correctly unique promotion", () => {
      const mockPromotion = { custom: { discountRate: 20 } };

      getActiveProductPromotionsStub.returns([mockPromotion]);

      const result = employeeHelpers.getActiveCustomerProductPromotion();

      assert.equal(result, mockPromotion);
    });
  });

  describe(".getDiscountRate()", () => {
    const hiringCountry = "DE";
    const companyID = "ACME";

    beforeEach(() => {
      getActiveCustomerProductPromotionStub = sinon.stub(
        employeeHelpers,
        "getActiveCustomerProductPromotion",
      );
    });

    it("should return 0 when no promotions retrieved (non-employee session)", () => {
      getActiveCustomerProductPromotionStub.returns(null);

      const result = employeeHelpers.getDiscountRate();

      assert.equal(result, 0);
    });

    it("should throw an error when promotion retrieval fails", () => {
      getActiveCustomerProductPromotionStub.throws(new Error("test error"));

      assert.throws(
        () => employeeHelpers.getDiscountRate(),
        Error,
        "test error",
      );
    });

    it("should throw when retrieved promotion has no positive discount rate", () => {
      global.session = { custom: { hiringCountry, companyID } };

      const promotionWithEmptyCustom = { custom: {} };

      getActiveCustomerProductPromotionStub.returns(promotionWithEmptyCustom);

      assert.throws(
        () => employeeHelpers.getDiscountRate(),
        Error,
        `Employee product promotion found for country [${hiringCountry}] and company [${companyID}], but it has no valid discount rate [undefined]`,
      );

      const promotionWithoutDiscount = { custom: { discountRate: null } };

      getActiveCustomerProductPromotionStub.returns(promotionWithoutDiscount);

      assert.throws(
        () => employeeHelpers.getDiscountRate(),
        Error,
        `Employee product promotion found for country [${hiringCountry}] and company [${companyID}], but it has no valid discount rate [null]`,
      );
    });

    it("should default companyID to Birkenstock when not set in session", () => {
      global.session = { custom: { hiringCountry } };

      const promotionWithoutDiscount = { custom: { discountRate: 0 } };

      getActiveCustomerProductPromotionStub.returns(promotionWithoutDiscount);

      assert.throws(
        () => employeeHelpers.getDiscountRate(),
        Error,
        `Employee product promotion found for country [${hiringCountry}] and company [Birkenstock], but it has no valid discount rate [0]`,
      );
    });

    it("should return discount rate from retrieved unique valid promotion", () => {
      const promotionWithDiscount = { custom: { discountRate: 20 } };

      getActiveCustomerProductPromotionStub.returns(promotionWithDiscount);

      const result = employeeHelpers.getDiscountRate();

      assert.equal(result, 20);
    });
  });

  describe(".hasFreeShipping()", () => {
    let getActiveShippingPromotionsStub;

    beforeEach(() => {
      getActiveShippingPromotionsStub = sinon.stub(
        employeeHelpers,
        "getActiveShippingPromotions",
      );
    });

    it("should return false when no active shipping promotions retrieved", () => {
      getActiveShippingPromotionsStub.returns(null);

      assert.isFalse(employeeHelpers.hasFreeShipping());

      getActiveShippingPromotionsStub.returns([]);

      assert.isFalse(employeeHelpers.hasFreeShipping());
    });

    it("should return true when shipping promotions exist", () => {
      getActiveShippingPromotionsStub.returns([shippingPromotionMock]);

      const result = employeeHelpers.hasFreeShipping();

      assert.isTrue(result);
    });
  });

  describe(".validateReferentialIntegrity()", () => {
    const EMPLOYEE_ID = "EMP001";
    const CUSTOMER_NO = "CUST123";
    const OTHER_CUSTOMER_NO = "CUST999";

    const createMockProfile = (customerNo, employeeNumber) => ({
      customerNo,
      custom: { employeeNumber },
    });

    const createMockEmployeeCO = (id, customerNumber) => ({
      custom: { ID: id, customerNumber },
    });

    it("should return empty array if no employeeCO is provided", () => {
      const result = employeeHelpers.validateReferentialIntegrity(null, []);

      assert.isArray(result);
      assert.isEmpty(result);
    });

    describe("when employee has no customer number", () => {
      it("should return empty array if no customer points back to the employee", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, ""),
          [],
        );

        assert.isArray(result);
        assert.isEmpty(result);
      });

      it("should report CUSTOMER_UNLINKED if a customer points to the employee", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, ""),
          [createMockProfile(CUSTOMER_NO, EMPLOYEE_ID)],
        );

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.include(result[0], EMPLOYEE_ID);
        assert.include(result[0], CUSTOMER_NO);
      });

      it("should report MULTI_CUSTOMER if multiple customers point to the employee", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, ""),
          [
            createMockProfile("CUST_A", EMPLOYEE_ID),
            createMockProfile("CUST_B", EMPLOYEE_ID),
          ],
        );

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.include(result[0], "CUST_A");
        assert.include(result[0], "CUST_B");
        assert.include(result[0], EMPLOYEE_ID);
      });
    });

    describe("when employee has customer number", () => {
      it("should report ORPHAN_EMPLOYEE_LINK if no customer references the employee", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, CUSTOMER_NO),
          [],
        );

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.include(result[0], EMPLOYEE_ID);
        assert.include(result[0], CUSTOMER_NO);
      });

      it("should report MULTI_CUSTOMER if multiple customers reference the employee", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, CUSTOMER_NO),
          [
            createMockProfile("CUST_A", EMPLOYEE_ID),
            createMockProfile("CUST_B", EMPLOYEE_ID),
          ],
        );

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.include(result[0], "CUST_A");
        assert.include(result[0], "CUST_B");
      });

      it("should report CROSS_LINK if the matching customer has a different customerNo than what the CO points to", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, CUSTOMER_NO),
          [createMockProfile(OTHER_CUSTOMER_NO, EMPLOYEE_ID)],
        );

        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.include(result[0], EMPLOYEE_ID);
        assert.include(result[0], CUSTOMER_NO);
        assert.include(result[0], OTHER_CUSTOMER_NO);
      });

      it("should return empty array if exactly one customer matches and customerNo matches CO", () => {
        const result = employeeHelpers.validateReferentialIntegrity(
          createMockEmployeeCO(EMPLOYEE_ID, CUSTOMER_NO),
          [createMockProfile(CUSTOMER_NO, EMPLOYEE_ID)],
        );

        assert.isArray(result);
        assert.isEmpty(result);
      });
    });
  });

  describe(".validateEmployeeCustomObject()", () => {
    const createMockEmployeeCO = (id, attrs) => ({
      custom: Object.assign(
        {
          ID: id,
          customerNumber: "",
          unlimitedDiscount: false,
          annualDiscountUsage: 0,
          countryCode: "DE",
          discountGroup: "A",
          zipCode: "12345",
        },
        attrs,
      ),
    });

    beforeEach(() => {
      EmployeeMgrMock = {
        getAnnualDiscountAllowance: sinon.stub().returns(1000),
      };

      employeeHelpers = proxyquire(
        "#cartridges/app_custom_core/cartridge/scripts/helpers/employeeHelpers",
        {
          "dw/campaign/PromotionMgr": PromotionMgrMock,
          "dw/web/Resource": ResourceMock,
          "dw/system/Transaction": Transaction,
          "*/cartridge/scripts/helpers/siteHelpers": siteHelpersStub,
          "*/cartridge/scripts/customObjects/employee/EmployeeMgr":
            EmployeeMgrMock,
        },
      );
    });

    it("should return referential integrity errors when present", () => {
      const profiles = [];

      sinon
        .stub(employeeHelpers, "validateReferentialIntegrity")
        .returns(["some error"]);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001"),
        profiles,
      );

      assert.isArray(result);
      assert.include(result, "some error");
    });

    it("should return empty array for valid employee with no integrity issues", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001"),
        profiles,
      );

      assert.isArray(result);
      assert.isEmpty(result);
    });

    it("should skip allowance validation if unlimitedDiscount is true", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001", {
          unlimitedDiscount: true,
          annualDiscountUsage: 99999,
        }),
        profiles,
      );

      assert.isArray(result);
      assert.isEmpty(result);
    });

    it("should report INVALID_ALLOWANCE if annualDiscountUsage is negative", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001", {
          annualDiscountUsage: -50,
          countryCode: "DE",
          discountGroup: "A",
        }),
        profiles,
      );

      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.include(result[0], "-50");
    });

    it("should report INVALID_ALLOWANCE if usage exceeds annual allowance", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);
      EmployeeMgrMock.getAnnualDiscountAllowance.returns(500);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001", {
          annualDiscountUsage: 600,
          countryCode: "DE",
          discountGroup: "A",
        }),
        profiles,
      );

      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.include(result[0], "600");
      assert.include(result[0], "500");
    });

    it("should return empty array when usage is zero", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001", { annualDiscountUsage: 0 }),
        profiles,
      );

      assert.isArray(result);
      assert.isEmpty(result);
    });

    it("should return empty array when usage is positive but within allowance", () => {
      const profiles = [];

      sinon.stub(employeeHelpers, "validateReferentialIntegrity").returns([]);
      EmployeeMgrMock.getAnnualDiscountAllowance.returns(1000);

      const result = employeeHelpers.validateEmployeeCustomObject(
        createMockEmployeeCO("EMP001", {
          annualDiscountUsage: 500,
          countryCode: "DE",
          discountGroup: "A",
        }),
        profiles,
      );

      assert.isArray(result);
      assert.isEmpty(result);
    });
  });

  describe(".getEmployeeErrors()", () => {
    const createMockEmployeeCO = (id, customerNumber) => ({
      custom: {
        ID: id,
        customerNumber: customerNumber || "",
        countryCode: "DE",
      },
    });

    const createMockProfile = (customerNo, employeeNumber) => ({
      customerNo: customerNo,
      custom: { employeeNumber: employeeNumber },
    });

    const createMockIterator = (items) => {
      let position = -1;

      return {
        hasNext: () => position + 1 < items.length,
        next: () => items[++position],
        close: sinon.stub(),
      };
    };

    beforeEach(() => {
      CustomObjectMgrMock = {
        getAllCustomObjects: sinon.stub(),
      };

      CustomerMgrMock = {
        searchProfiles: sinon.stub(),
      };

      employeeHelpers = proxyquire(
        "#cartridges/app_custom_core/cartridge/scripts/helpers/employeeHelpers",
        {
          "dw/campaign/PromotionMgr": PromotionMgrMock,
          "dw/web/Resource": ResourceMock,
          "dw/system/Transaction": Transaction,
          "*/cartridge/scripts/helpers/siteHelpers": siteHelpersStub,
          "dw/object/CustomObjectMgr": CustomObjectMgrMock,
          "dw/customer/CustomerMgr": CustomerMgrMock,
        },
      );
    });

    it("should return empty array when no employee COs exist", () => {
      const employeeIterator = createMockIterator([]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      const result = employeeHelpers.getEmployeeErrors();

      assert.isArray(result);
      assert.isEmpty(result);
    });

    it("should close both iterators even when no errors", () => {
      const employeeIterator = createMockIterator([]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      employeeHelpers.getEmployeeErrors();

      assert.isTrue(employeeIterator.close.calledOnce);
      assert.isTrue(profileIterator.close.calledOnce);
    });

    it("should catch errors and return error message array instead of throwing", () => {
      const employeeIterator = createMockIterator([
        createMockEmployeeCO("EMP001"),
      ]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon
        .stub(employeeHelpers, "validateEmployeeCustomObject")
        .throws(new Error("unexpected"));

      const result = employeeHelpers.getEmployeeErrors();

      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.include(result[0], "Error validating");
      assert.include(result[0], "unexpected");
      assert.isTrue(employeeIterator.close.calledOnce);
      assert.isTrue(profileIterator.close.calledOnce);
    });

    it("should collect errors from validateEmployeeCustomObject for each CO", () => {
      const co1 = createMockEmployeeCO("EMP001", "CUST001");
      const co2 = createMockEmployeeCO("EMP002", "CUST002");
      const employeeIterator = createMockIterator([co1, co2]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon
        .stub(employeeHelpers, "validateEmployeeCustomObject")
        .onFirstCall()
        .returns(["error for EMP001"])
        .onSecondCall()
        .returns([]);

      const result = employeeHelpers.getEmployeeErrors();

      assert.isArray(result);
      assert.lengthOf(result, 1);
      assert.include(result[0], "EMP001");
    });

    it("should detect ORPHAN_CUSTOMER_LINK — customer has employeeNumber but no matching CO exists", () => {
      const employeeIterator = createMockIterator([
        createMockEmployeeCO("EMP001"),
      ]);
      const orphanProfile = createMockProfile("CUST999", "EMP_NONEXISTENT");
      const profileIterator = createMockIterator([orphanProfile]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon.stub(employeeHelpers, "validateEmployeeCustomObject").returns([]);

      const result = employeeHelpers.getEmployeeErrors();

      assert.isArray(result);
      // should have at least one error about orphan customer
      const orphanErrors = result.filter((e) => e.includes("CUST999"));

      assert.isAbove(orphanErrors.length, 0);
    });

    it("should group multiple profiles with the same employeeNumber in the customer map", () => {
      const co = createMockEmployeeCO("EMP001", "CUST100");
      const employeeIterator = createMockIterator([co]);
      const profile1 = createMockProfile("CUST100", "EMP001");
      const profile2 = createMockProfile("CUST200", "EMP001");
      const profileIterator = createMockIterator([profile1, profile2]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      const result = employeeHelpers.getEmployeeErrors();

      assert.isArray(result);
      const multiCustomerErrors = result.filter((e) =>
        e.includes("MULTI_CUSTOMER"),
      );

      assert.isAbove(multiCustomerErrors.length, 0);
    });

    it("should query CustomerMgr.searchProfiles exactly once (not per employee)", () => {
      const employeeIterator = createMockIterator([
        createMockEmployeeCO("EMP001"),
        createMockEmployeeCO("EMP002"),
        createMockEmployeeCO("EMP003"),
      ]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      employeeHelpers.getEmployeeErrors();

      assert.isTrue(CustomerMgrMock.searchProfiles.calledOnce);
    });

    it("should detect MULTI_EMPLOYEE when two COs reference the same customerNumber", () => {
      const co1 = createMockEmployeeCO("EMP001", "CUST100");
      const co2 = createMockEmployeeCO("EMP002", "CUST100");
      const employeeIterator = createMockIterator([co1, co2]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon.stub(employeeHelpers, "validateEmployeeCustomObject").returns([]);

      const result = employeeHelpers.getEmployeeErrors();
      const multiErrors = result.filter((e) => e.includes("MULTI_EMPLOYEE"));

      assert.lengthOf(multiErrors, 1);
      assert.include(multiErrors[0], "CUST100");
      assert.include(multiErrors[0], "EMP001");
      assert.include(multiErrors[0], "EMP002");
    });

    it("should not report MULTI_EMPLOYEE when each CO has a unique customerNumber", () => {
      const co1 = createMockEmployeeCO("EMP001", "CUST100");
      const co2 = createMockEmployeeCO("EMP002", "CUST200");
      const employeeIterator = createMockIterator([co1, co2]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon.stub(employeeHelpers, "validateEmployeeCustomObject").returns([]);

      const result = employeeHelpers.getEmployeeErrors();
      const multiErrors = result.filter((e) => e.includes("MULTI_EMPLOYEE"));

      assert.lengthOf(multiErrors, 0);
    });

    it("should not track empty customerNumbers for MULTI_EMPLOYEE detection", () => {
      const co1 = createMockEmployeeCO("EMP001", "");
      const co2 = createMockEmployeeCO("EMP002", "");
      const employeeIterator = createMockIterator([co1, co2]);
      const profileIterator = createMockIterator([]);

      CustomObjectMgrMock.getAllCustomObjects.returns(employeeIterator);
      CustomerMgrMock.searchProfiles.returns(profileIterator);

      sinon.stub(employeeHelpers, "validateEmployeeCustomObject").returns([]);

      const result = employeeHelpers.getEmployeeErrors();
      const multiErrors = result.filter((e) => e.includes("MULTI_EMPLOYEE"));

      assert.lengthOf(multiErrors, 0);
    });
  });
});

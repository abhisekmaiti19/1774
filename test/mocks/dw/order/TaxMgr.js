function TaxMgr() {

}

TaxMgr.TAX_POLICY_GROSS = 0;
TaxMgr.TAX_POLICY_NET = 1;

TaxMgr.taxationPolicy = TaxMgr.TAX_POLICY_GROSS;

TaxMgr.getTaxationPolicy = function () {
    return TaxMgr.TAX_POLICY_GROSS;
};

TaxMgr.getDefaultTaxJurisdictionID = function () {
    return 'defaultTaxJurisdictionID';
};

TaxMgr.getTaxJurisdictionID = function () {
    return 'taxJurisdictionID';
};

TaxMgr.getTaxRate = function () {
    return 0.01;
};

module.exports = TaxMgr;

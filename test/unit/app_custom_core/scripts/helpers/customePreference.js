'use strict';

const assert = require('chai').assert;
const proxyquire = require('proxyquire').noCallThru();
const utils = require('#cartridges/app_custom_core/cartridge/scripts/utils/index');

describe('app_custom_core/scripts/helpers/customPreference', () => {
    const importPreference = (customPrefs) => {
        const mockSite = {
            getCurrent: () => ({
                getPreferences: () => ({
                    getCustom: () => customPrefs
                })
            })
        };

        return proxyquire('#cartridges/app_custom_core/cartridge/scripts/helpers/customPreference', {
            'dw/system/Site': mockSite,
            '*/cartridge/scripts/utils': utils
        });
    };

    it('should importPreference without throwing (safeParseJSON must be imported)', () => {
        assert.doesNotThrow(() => {
            importPreference({});
        });
    });

    it('should read the active flag from the site preference', () => {
        assert.isTrue(importPreference({ isEmployeeBenifitActive: true }).isEmployeeBenifitsActive);
        assert.isFalse(importPreference({ isEmployeeBenifitActive: false }).isEmployeeBenifitsActive);
    });

    it('should be inactive when the site preference is not set', () => {
        assert.isFalse(importPreference({}).isEmployeeBenifitsActive);
    });

    it('should parse the configuration when it is a JSON string', () => {
        const customPreference = importPreference({ employeeBenifitsConfigs: '{"1774":{"US":1000,"DE":500}}' });

        assert.deepEqual(customPreference.employeeBenifitsConfigs, { 1774: { US: 1000, DE: 500 } });
    });

    it('should use the configuration as is when it is already an object', () => {
        const customPreference = importPreference({ employeeBenifitsConfigs: { 1774: { US: 1000 } } });

        assert.deepEqual(customPreference.employeeBenifitsConfigs, { 1774: { US: 1000 } });
    });

    it('should fall back to an empty configuration when it is not set', () => {
        assert.deepEqual(importPreference({}).employeeBenifitsConfigs, {});
    });

    it('should fall back to an empty configuration when the JSON is invalid', () => {
        assert.deepEqual(importPreference({ employeeBenifitsConfigs: '{not valid json' }).employeeBenifitsConfigs, {});
    });
});

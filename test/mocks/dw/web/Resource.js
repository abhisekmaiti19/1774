'use strict';

const path = require('path');
const siteUtil = require('../../../../utils/helpers/meta/site');
const siteID = siteUtil.getSiteID();
const useMock = true;
const cartridgePath = siteUtil.getCartridgePath(siteID, useMock);
const properties = require('properties-parser');
const locale = 'x_default';

const bundleList = [
    '_assets',
    '_preferences',
    'global',
    'locale',
    'countries_de',
    '_mailStyles',
    'version',
    'cybersource'
];

function getBundlePath(resourceDirPath, bundleName) {
    let bundlePath = '';
    const localPath = (locale !== 'x_default') ? '_' + locale : '';

    if (resourceDirPath) {
        bundlePath = resourceDirPath + bundleName + localPath + '.properties';

        return path.resolve(bundlePath);
    }

    return bundlePath;
}

function msg(key, bundleName, defaultValue) {
    const keyMarker = (bundleList.indexOf(bundleName) > -1 || (key.length && key.indexOf('validation.patterns') > -1));
    let bundlePath;
    let props;

    if (!key || !bundleName) {
        return defaultValue;
    }

    if (!cartridgePath) {
        return key;
    }

    for (let i = 0; i < cartridgePath.length; i++) {
        const cartridge = cartridgePath[i];
        const resourceDirPath = './cartridges/' + cartridge + '/cartridge/templates/resources/';

        bundlePath = getBundlePath(resourceDirPath, bundleName);

        try {
            props = properties.read(bundlePath);

            if (props[key]) {
                return keyMarker ? props[key] : `${bundleName}.${key}`;
            }
        } catch (e) {
            // continue
        }
    }

    return defaultValue || key;
}

function msgf() {
    // pass through to msg if there are no extra format arguments
    if (arguments.length < 4) {
        return msg.apply(null, arguments);
    }

    const args = Array.prototype.slice.call(arguments);
    const value = msg.apply(null, args.slice(0, 3));
    const msgfArgs = args.slice(3, arguments.length).join('.');
    const bundleName = args[1];

    if (bundleList.indexOf(bundleName) > -1) {
        return value.replace(/{(\d)}/g, function (match, p) {
            const position = Number(p);

            if (args[position + 3]) {
                return args[position + 3];
                // if no arguments found, return the original placeholder
            }

            return match;
        });
    }

    return `${value}.${msgfArgs}`;
}

module.exports = {
    msg: msg,
    msgf: msgf,
    locale: locale
};

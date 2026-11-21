'use strict';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const dateHelpers = {};

/**
 * @description compute the difference in days (rounded up) between two dates
 *
 * @param {Date} date1 - first date
 * @param {Date} date2 - second date
 * @param {boolean} ignoreTime - if true, the dates' time is ignored in the calculation.
 * Set to true to take into account the Dailight Saving Time switch and time zone differences.
 *
 * @returns {number|NaN} - days between the two dates, or NaN if either date is not a Date instance
 */

dateHelpers.computeDaysDifference = function (date1, date2, ignoreTime) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
        return NaN;
    }

    let dateDifference = date1.getTime() - date2.getTime();

    if (ignoreTime) {
        const date1Time = date1.getTime() % MILLISECONDS_PER_DAY;
        const date2Time = date2.getTime() % MILLISECONDS_PER_DAY;

        dateDifference -= date1Time - date2Time;
    }

    return Math.ceil(Math.abs(dateDifference) / MILLISECONDS_PER_DAY);
};

module.exports = dateHelpers;

function Calendar(date) {
    this.date = date ? new Date(date) : new Date();
}

Calendar.AM_PM = 9;
Calendar.APRIL = 3;
Calendar.AUGUST = 7;
Calendar.DATE = 5;
Calendar.DAY_OF_MONTH = 5;
Calendar.DAY_OF_WEEK = 7;
Calendar.DAY_OF_WEEK_IN_MONTH = 8;
Calendar.DAY_OF_YEAR = 6;
Calendar.DECEMBER = 11;
Calendar.DST_OFFSET = 16;
Calendar.ERA = 0;
Calendar.FEBRUARY = 1;
Calendar.FRIDAY = 6;
Calendar.HOUR = 10;
Calendar.HOUR_OF_DAY = 11;
Calendar.INPUT_DATE_PATTERN = 3;
Calendar.INPUT_DATE_TIME_PATTERN = 5;
Calendar.INPUT_TIME_PATTERN = 4;
Calendar.JANUARY = 0;
Calendar.JULY = 6;
Calendar.JUNE = 5;
Calendar.LONG_DATE_PATTERN = 1;
Calendar.MARCH = 2;
Calendar.MAY = 4;
Calendar.MILLISECOND = 14;
Calendar.MINUTE = 12;
Calendar.MONDAY = 2;
Calendar.MONTH = 2;
Calendar.NOVEMBER = 10;
Calendar.OCTOBER = 9;
Calendar.SATURDAY = 7;
Calendar.SECOND = 13;
Calendar.SEPTEMBER = 8;
Calendar.SHORT_DATE_PATTERN = 0;
Calendar.SUNDAY = 1;
Calendar.THURSDAY = 5;
Calendar.TIME_PATTERN = 2;
Calendar.TUESDAY = 3;
Calendar.WEDNESDAY = 4;
Calendar.WEEK_OF_MONTH = 4;
Calendar.WEEK_OF_YEAR = 3;
Calendar.YEAR = 1;
Calendar.ZONE_OFFSET = 15;

Calendar.prototype.get = function (value) {
    let result;

    switch (value) {
        case Calendar.YEAR:
            result = this.date.getFullYear();
            break;
        case Calendar.MONTH:
            result = this.date.getMonth();
            break;
        case Calendar.DAY_OF_MONTH:
            result = this.date.getDate();
            break;
        case Calendar.HOUR_OF_DAY:
            result = this.date.getHours();
            break;
        case Calendar.MINUTE:
            result = this.date.getMinutes();
            break;
        case Calendar.SECOND:
            result = this.date.getSeconds();
            break;
        case Calendar.MILLISECOND:
            result = this.date.getMilliseconds();
            break;
        case Calendar.DAY_OF_WEEK:
            result = this.date.getDay() + 1;
            break;
        default:
            result = null;
    }

    return result;
};

Calendar.prototype.set = function (field, value) {
    switch (field) {
        case Calendar.HOUR_OF_DAY:
            this.date.setHours(value);
            break;
        case Calendar.MINUTE:
            this.date.setMinutes(value);
            break;
        case Calendar.SECOND:
            this.date.setSeconds(value);
            break;
        case Calendar.MILLISECOND:
            this.date.setMilliseconds(value);
            break;
        case Calendar.YEAR:
            this.date.setFullYear(value);
            break;
        case Calendar.MONTH:
            this.date.setMonth(value);
            break;
        case Calendar.DAY_OF_MONTH:
            this.date.setDate(value);
            break;
        case Calendar.WEEK_OF_MONTH:
            this.date.setDate((value - 1) * 7 + 1);
            break;
        case Calendar.DAY_OF_WEEK:
            this.date.setDate(this.date.getDate() - this.date.getDay() + (value - 1));
            break;
        default:
            this.date.setTime(value);
    }
};

Calendar.prototype.add = function (field, value) {
    switch (field) {
        case Calendar.DATE:
            this.date.setDate(this.date.getDate() + value);
            break;
        case Calendar.MONTH:
            this.date.setMonth(this.date.getMonth() + value);
            break;
        case Calendar.YEAR:
            this.date.setFullYear(this.date.getFullYear() + value);
            break;
        default:
            this.date.setTime(this.date.getTime() + value);
    }
};

Calendar.prototype.before = function (calendar) {
    // Make sure we're comparing times down to milliseconds
    return this.date.getTime() < calendar.date.getTime();
};

Calendar.prototype.after = function (calendar) {
    // Make sure we're comparing times down to milliseconds
    return this.date.getTime() > calendar.date.getTime();
};

Calendar.prototype.getTime = function () {
    return new Date(this.date);
};

Calendar.prototype.setTime = function (date) {
    return this.date.setTime(date.getTime());
};

Calendar.prototype.setTimeZone = function (timeZone) {
    this.timeZone = timeZone;
};

Calendar.prototype.parseByFormat = function () {
    this.date = new Date();
};

Calendar.prototype.now = function () {
    this.date = new Date();
};

Calendar.prototype.after = function () {
    return true;
};

Calendar.prototype.before = function () {
    return true;
};

Calendar.prototype.isSameDay = function (calendar) {
    return this.get(Calendar.YEAR) === calendar.get(Calendar.YEAR) &&
        this.get(Calendar.MONTH) === calendar.get(Calendar.MONTH) &&
        this.get(Calendar.DAY_OF_MONTH) === calendar.get(Calendar.DAY_OF_MONTH);
};

module.exports = Calendar;

class Locale {
    static getLocale(locale) {
        if (!locale) {
            return null;
        }

        return new Locale(locale);
    }

    constructor(locale) {
        const localeParts = locale.split('_');

        this.language = localeParts[0];
        this.country = localeParts[1];
        this.ID = locale;
        this.displayCountry = locale;
        this.getCountry = () => this.country;
        this.displayLanguage = this.getDisplayLanguage();
    }

    getLanguage() {
        return this.language;
    }

    getCountry() {
        return this.country;
    }

    getDisplayCountry() {
        return this.displayCountry;
    }

    getDisplayLanguage() {
        return this.getLanguage() + 'DisplayLanguage';
    }

    getID() {
        return this.ID;
    }
}

module.exports = Locale;

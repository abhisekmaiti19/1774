class ServiceConfig {
    credential;

    ID;

    profile;

    serviceType;

    getCredential() {
        return this.credential;
    }

    getID() {
        return this.ID;
    }

    getProfile() {
        return this.profile;
    }

    getServiceType() {
        return this.serviceType;
    }
}

module.exports = ServiceConfig;

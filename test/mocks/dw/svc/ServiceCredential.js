class ServiceCredential {
    ID;

    password;

    URL;

    user;

    getEncryptedPassword() {
        return 'encrypted password (' + this.password + ')';
    }

    getPassword() {
        return this.password;
    }

    getID() {
        return this.ID;
    }

    getURL() {
        return this.URL;
    }

    getUser() {
        return this.user;
    }
}

module.exports = ServiceCredential;

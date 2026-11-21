class File {
    static IMPEX = 'IMPEX';

    static SEPARATOR = '/';

    LIBRARIES = 'LIBRARIES';

    filePath = null;

    constructor(filePath, fileName) {
        this.initialize(filePath, fileName);
    }

    initialize(filePath, fileName) {
        if (fileName) {
            this.name = fileName;
            this.filePath = filePath.filePath;
            this.fullPath = this.filePath + File.SEPARATOR + this.name;
        } else {
            this.filePath = filePath;
            const pathParts = filePath.split('/');

            this.name = pathParts[pathParts.length - 1];
        }
    }

    getFilePath() {
        return this.filePath;
    }

    exists() {
        return true;
    }

    listFiles() {
        return [];
    }

    length() {
        return this.filePath.length;
    }

    remove() {}

    mkdir() {}

    mkdirs() {}

    isFile() {}

    isDirectory() {}

    createNewFile() {}

    getName() {}
}

module.exports = File;

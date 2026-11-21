const LIMIT_FOR_READ = 2;

class FileReader {
    constructor(file) {
        this.string = file.filePath;
        this.readCount = 0;
    }

    readN(bytesToRead) {
        if (this.readCount === LIMIT_FOR_READ) {
            // End of a file
            return null;
        } else if (this.readCount === LIMIT_FOR_READ - 1) {
            // Emulate end of a file with partial output
            bytesToRead = Math.round(bytesToRead / 2);
        }

        this.readCount++;

        return new Array(bytesToRead + 1).join('a');
    }

    close() {}
}

module.exports = FileReader;

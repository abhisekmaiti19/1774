function FileWriter(file) {
    this.file = file;
    this.buffer = '';
}

FileWriter.prototype.writeLine = function (str) {
    this.buffer += str + '\n';
};

FileWriter.prototype.close = function () {
    // dummy
};

module.exports = FileWriter;

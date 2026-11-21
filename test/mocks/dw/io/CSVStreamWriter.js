function CSVStreamWriter(writer) {
    this.writer = writer;
}

CSVStreamWriter.prototype.writeNext = function (...args) {
    this.writer.writeLine(args.map(a => `"${a}"`).join(','));
};

CSVStreamWriter.prototype.close = function () {
    this.writer.close();
};

module.exports = CSVStreamWriter;

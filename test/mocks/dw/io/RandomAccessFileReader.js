'use strict';

const sinon = require('sinon');

/**
 * Mock for dw.io.RandomAccessFileReader
 *
 * @param {dw.io.File} file - The file to be read.
 */
function RandomAccessFileReader(file) {
    this.file = file;
    this.readBytes = sinon.stub();
    this.close = sinon.stub();
    this.getPosition = sinon.stub().returns(0);
    this.length = sinon.stub().returns(0);
    this.readByte = sinon.stub();
    this.setPosition = sinon.stub();
}

module.exports = RandomAccessFileReader;

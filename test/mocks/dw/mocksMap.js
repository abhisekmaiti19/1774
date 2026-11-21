const fs = require('fs');
const path = require('path');

function getFiles(folderPath = __dirname) {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => !file.isDirectory())
        .map(file => ({ ...file, path: path.join(folderPath, file.name) }));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders) {
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...getFiles(path.join(folderPath, folder.name)));
    }

    return files;
}

/**
 * @param {string} filePath - path
 * @returns {string} relative path without .js extension
 */
function getRelativePath(filePath) {
    return filePath.substring(__dirname.length, filePath.length - 3);
}

const dwMockNames = getFiles()
    .filter(file => path.basename(file.path) !== 'index.js' && !file.path.includes(path.join('dw', 'mocks')))
    .map(file => 'dw' + getRelativePath(file.path).replace(/\\/g, '/'));

const mocksMap = {};

dwMockNames.forEach(mockName => {
    Object.defineProperty(mocksMap, mockName, {
        enumerable: true,
        get() {
            return require(path.resolve(__dirname, '..', mockName));
        }
    });
});

module.exports = mocksMap;

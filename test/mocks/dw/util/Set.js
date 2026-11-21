const Collection = require('./Collection');

class Set extends Collection {
    static EMPTY_SET = Object.freeze(new Set());
}

module.exports = Set;

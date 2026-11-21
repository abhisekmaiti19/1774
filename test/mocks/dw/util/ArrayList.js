const Collection = require('./Collection');

function ArrayList(...params) {
    Collection.apply(this, params);

    this.push = (item) => {
        this.add.call(this, item);
    };

    this.addAt = (index, item) => {
        // this would benefit from using class inheritance with private properties
        const items = this.toArray();

        this.removeAll.call(this);
        items.splice(index, 0, item);
        this.addAll.call(this, new Collection(items));

        return true;
    };
}

ArrayList.prototype = Object.create(Collection.prototype, {});

module.exports = ArrayList;

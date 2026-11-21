const testContent = require('#mocks/testDataMgr/instances/dw/content/Content');
const Collection = require('../util/Collection');
const Content = require('./Content');
const Folder = require('./Folder');

function ContentMgr() {}

ContentMgr.getContent = function (id) {
    return testContent.getContent(id);
};

ContentMgr.getSiteLibrary = function () {
    return {
        getRoot() {
            return new Folder({
                subFolders: new Collection([new Folder({
                    ID: 'folder_1',
                    online: true,
                    content: new Collection([new Content({
                        ID: 'content_1',
                        online: true
                    }), new Content({
                        ID: 'content_2',
                        online: false
                    })])
                }), new Folder({
                    ID: 'folder_2',
                    online: false,
                    content: new Collection([new Content({
                        ID: 'content_3',
                        online: true
                    })]),
                    subFolders: new Collection([new Folder({
                        ID: 'folder_3',
                        online: true
                    })])
                })])
            });
        }
    };
};

module.exports = ContentMgr;

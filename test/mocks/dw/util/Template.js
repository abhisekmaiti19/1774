const MimeEncodedText = require('../value/MimeEncodedText');

class Template {
    template;

    constructor(template) {
        this.template = template;
    }

    render() {
        // return as string template path that should be rendered to be able verify if correct template was rendered
        return new MimeEncodedText(this.template || '');
    }
}

module.exports = Template;

const List = require('../../dw/util/List');
const Status = require('../../dw/system/Status');

class Mail {
    bcc = new List('bbc@reciver.example');

    cc = new List('cc@reciver.example');

    from = 'noreply@domain.com';

    subject = 'Email Subject Example';

    to = new List('recipient1@domain.com', 'recipient2@domain.com');

    addBcc(bcc) {
        this.bcc.add(bcc);

        return this;
    }

    addCc(cc) {
        this.cc.add(cc);

        return this;
    }

    addTo(to) {
        this.to.add(to);

        return this;
    }

    getBcc() {
        return this.bcc;
    }

    getCc() {
        return this.cc;
    }

    getFrom() {
        return this.from;
    }

    getSubject() {
        return this.subject;
    }

    getTo() {
        return this.to;
    }

    send() {
        return Status.OK;
    }

    setBcc(bcc) {
        this.bcc = bcc;

        return this;
    }

    setCc(cc) {
        this.cc = cc;

        return this;
    }

    setContent(content) {
        this.content = content;

        return this;
    }

    setFrom(from) {
        this.from = from;

        return this;
    }

    setSubject(subject) {
        this.subject = subject;

        return this;
    }

    setTo(to) {
        this.to = to;

        return this;
    }
}

module.exports = Mail;
